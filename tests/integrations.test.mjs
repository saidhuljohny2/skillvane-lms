import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { completeVerifiedPayment } from '../server/payments.js';
import { processDeliveryJobs } from '../server/delivery.js';
import { grantAndTrackDriveAccess } from '../server/drive-access-status.js';
import webhook from '../api/payment-webhook.js';
import studentHandler from '../api/student.js';
import createOrder from '../api/create-order.js';
import adminHandler from '../api/admin.js';
import { calculateOrderAmount } from '../server/payment-pricing.js';

const uid='11111111-1111-4111-8111-111111111111';
let calls, payment, order, jobs, folders, role, catalog;
function response() { return { code:200, status(n){this.code=n;return this;},json(data){this.data=data;return this;},setHeader(){} }; }
function mock(handler) { globalThis.fetch=async(url,init={})=>{const c={url:String(url),method:init.method||'GET',body:init.body?JSON.parse(init.body):null,headers:init.headers}; calls.push(c);const v=handler(c);return new Response(JSON.stringify(v.body??v),{status:typeof v.status === "number" ? v.status : 200});}; }
function service(c) {
 if(c.url.endsWith('/auth/v1/user')) return {id:uid,email:'student@example.test'};
 if(c.url.includes('/payments/pay_')) return payment;
 if(c.url.includes('/orders/')&&c.url.endsWith('/payments')) return {items:[payment]};
 if(c.url.includes('/payment_orders?')) return [order];
 if(c.url.includes('/profiles?')) return [{email:'student@example.test',full_name:'Student',phone:'9999999999',role}];
 if(c.url.includes('/courses?')) return catalog;
 if(c.url.endsWith('/rpc/complete_payment_enrollment')) return order.course_ids;
 if(c.url.endsWith('/rpc/claim_delivery_jobs')) return jobs;
 if(c.url==='https://drive.test/') return {ok:true,folders};
 return [];
}
test.beforeEach(()=>{
 calls=[];jobs=[];folders=['python-de'];role='student';
 order={order_id:'order_test',student_id:uid,student_email:'student@example.test',course_ids:['python-de'],amount_paise:59900,status:'created',payment_id:null};
 payment={id:'pay_test',order_id:'order_test',amount:59900,currency:'INR',status:'captured',captured:true};
 catalog=[{id:'python-de',title:'Python',status:'published',sale_enabled:true,delivery_mode:'drive',drive_url:'https://drive.google.com/drive/folders/abcdefghijk',notes_url:'https://drive.google.com/drive/folders/abcdefghijk',certificate_module_count:4}];
 Object.assign(process.env,{VITE_SUPABASE_URL:'https://auth.test',VITE_SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service',RAZORPAY_KEY_ID:'key',RAZORPAY_KEY_SECRET:'secret',RAZORPAY_WEBHOOK_SECRET:'webhook-secret',GOOGLE_DRIVE_ACCESS_WEBHOOK_URL:'https://drive.test/',GOOGLE_DRIVE_ACCESS_SECRET:'drive-secret'});
 delete process.env.EMAILJS_PRIVATE_KEY;
 mock(service);
});
for(const [label,change] of [['authorized',{status:'authorized',captured:false}],['wrong amount',{amount:1}],['wrong currency',{currency:'USD'}],['wrong order',{order_id:'order_other'}]]) test(`payment rejects ${label} before any database mutation`,async()=>{
 Object.assign(payment,change); await assert.rejects(completeVerifiedPayment('order_test','pay_test',uid), error => error.statusCode === 409);
 assert.ok(!calls.some(c=>c.method!=='GET'));
});
test('wrong student cannot verify another account payment',async()=>{await assert.rejects(completeVerifiedPayment('order_test','pay_test','other'),/does not belong/);assert.equal(calls.length,1);});
test('captured payment uses a single enrollment RPC then the delivery queue',async()=>{
 const r=await completeVerifiedPayment('order_test','pay_test',uid);assert.equal(r.verified,true);assert.equal(r.invoiceNo,'SV-order_test');
 assert.deepEqual(calls.find(c=>c.url.endsWith('/rpc/complete_payment_enrollment')).body,{p_order_id:'order_test',p_payment_id:'pay_test',p_student_id:uid});
 assert.ok(!calls.some(c=>c.url.includes('/enrollments?')));
});
test('provider HTTP errors do not grant enrollment',async()=>{mock(c=>c.url.includes('api.razorpay.com')?{status:503,body:{}}:service(c));await assert.rejects(completeVerifiedPayment('order_test','pay_test',uid));assert.ok(!calls.some(c=>c.method==='POST'));});
test('partial Drive response never marks missing course granted',async()=>{
 catalog.push({...catalog[0],id:'project-healthcare'});
 const r=await grantAndTrackDriveAccess(uid,'student@example.test',['python-de','project-healthcare']);
 assert.equal(r.granted,false);
 const records=calls.filter(c=>c.url.includes('/drive_access_grants?')).flatMap(c=>c.body);
 assert.equal(records.find(r=>r.course_id==='python-de').status,'granted');
 assert.equal(records.find(r=>r.course_id==='project-healthcare').status,'failed');
});
test('unconfigured course resources cannot be reported as granted',async()=>{catalog[0].notes_url='';const r=await grantAndTrackDriveAccess(uid,'student@example.test',['python-de']);assert.equal(r.granted,false);assert.ok(!calls.some(c=>c.url==='https://drive.test/'));});
test('missing email configuration records a retriable failure without sending',async()=>{
 order.status='paid';jobs=[{id:'job-test',order_id:'order_test',kind:'invoice',attempts:1,lease_token:'lease-test'}];
 const r=await processDeliveryJobs('order_test');assert.equal(r[0].status,'failed');
 const update=calls.find(c=>c.url.includes('/delivery_jobs?'));assert.match(update.url,/lease_token=eq.lease-test/);assert.ok(update.body.next_attempt_at);assert.ok(!calls.some(c=>c.url.includes('emailjs.com')));
});
test('payment recovery shares captured validation and queues Drive delivery',async()=>{const r=response();await studentHandler({method:'POST',headers:{authorization:'Bearer user'},body:{action:'recover-payment'}},r);assert.equal(r.code,200);assert.equal(r.data.recovered,true);assert.ok(calls.some(c=>c.url.endsWith('/rpc/claim_delivery_jobs')));});
test('certificate ignores arbitrary posted names and dates and asks DB to authorize',async()=>{
 mock(c=>c.url.endsWith('/rpc/issue_student_certificate')?{status:403,body:{message:'Enrollment is required'}}:service(c));
 const r=response();await studentHandler({method:'POST',headers:{authorization:'Bearer user'},body:{action:'certificate',courseId:'python-de',studentName:'Forged',completionDate:'2000-01-01'}},r);
 assert.equal(r.code,403);assert.deepEqual(calls.find(c=>c.url.endsWith('/rpc/issue_student_certificate')).body,{p_student_id:uid,p_course_id:'python-de'});
});
test('catalog prevents creating orders for paused resources',async()=>{catalog[0].sale_enabled=false;const r=response();await createOrder({method:'POST',headers:{authorization:'Bearer user'},body:{courseIds:['python-de']}},r);assert.equal(r.code,409);assert.ok(!calls.some(c=>c.url.includes('api.razorpay.com')));});
test('price validation rejects prototype property names',()=>{assert.throws(()=>calculateOrderAmount(['__proto__']));});
test('admin course update accepts the proper envelope',async()=>{role='admin';const r=response();await adminHandler({method:'PATCH',headers:{authorization:'Bearer admin'},body:{entity:'course',id:'python-de',values:{title:'New title'}}},r);assert.equal(r.code,200);assert.equal(calls.find(c=>c.method==='PATCH').body.title,'New title');});
test('webhook validates original raw bytes before trusting payment event',async()=>{
 const raw=JSON.stringify({event:'payment.captured',payload:{payment:{entity:payment}}},null,2);
 let req=Readable.from([Buffer.from(raw)]);req.method='POST';req.headers={'x-razorpay-signature':'0'.repeat(64)};
 let r=response();await webhook(req,r);assert.equal(r.code,400);assert.equal(calls.length,0);
 req=Readable.from([Buffer.from(raw)]);req.method='POST';req.headers={'x-razorpay-signature':crypto.createHmac('sha256','webhook-secret').update(raw).digest('hex')};
 r=response();await webhook(req,r);assert.equal(r.code,200);assert.ok(calls.some(c=>c.url.endsWith('/rpc/complete_payment_enrollment')));
});

test('Drive Apps Script authenticates resources and reports partial grants accurately', async()=>{
 const { readFile }=await import('node:fs/promises');const vm=await import('node:vm');const granted=[];
 const context=vm.createContext({console,PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'drive-secret'})},Utilities:{computeHmacSha256Signature:(m,s)=>[...crypto.createHmac('sha256',s).update(m).digest()]},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>text})},DriveApp:{getFolderById:id=>({addViewer:email=>{if(id==='failedfolder')throw new Error('No permission');granted.push([id,email]);}}),getFileById:id=>({addViewer:email=>granted.push([id,email])})}});
 vm.runInContext(await readFile('scripts/google-drive-enrollment.gs','utf8'),context);
 const data={email:'student@example.test',courseIds:['python-de','project-healthcare'],resources:{'python-de':[{id:'abcdefghijk',type:'folder'}],'project-healthcare':[{id:'failedfolder',type:'folder'}]},timestamp:Date.now()};
 const signature=crypto.createHmac('sha256','drive-secret').update(JSON.stringify(data)).digest('hex');
 assert.deepEqual(JSON.parse(context.doPost({postData:{contents:JSON.stringify({...data,signature:'wrong'})}})),{ok:false});assert.equal(granted.length,0);
 const result=JSON.parse(context.doPost({postData:{contents:JSON.stringify({...data,signature})}}));
 assert.deepEqual(result.folders,['python-de']);assert.equal(granted.length,1);
});

test('Sheets Apps Script rejects unsigned writes, deduplicates retries and escapes formulas',async()=>{
 const { readFile }=await import('node:fs/promises');const vm=await import('node:vm');const rows=[];
 const sheet={getLastRow:()=>rows.length,appendRow:row=>rows.push(row),getRange:()=>({createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.some(r=>r[0]===id)})})})};
 const context=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:key=>key==='SHEET_WEBHOOK_SECRET'?'sheet-secret':key==='SPREADSHEET_ID'?'sheet-test':null})},Utilities:{computeHmacSha256Signature:(m,s)=>[...crypto.createHmac('sha256',s).update(m).digest()]},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>text})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet})}});
 vm.runInContext(await readFile('scripts/google-sheet-enrollment.gs','utf8'),context);
 assert.equal(JSON.parse(context.doPost({postData:{contents:'{}'}})).ok,false);assert.equal(rows.length,0);
 const message=JSON.stringify({eventId:'stable-job-id',record:{name:'=HYPERLINK("bad")',invoice_no:'SV-order',amount:'599'},timestamp:Date.now()});
 const contents=JSON.stringify({message,signature:crypto.createHmac('sha256','sheet-secret').update(message).digest('hex')});
 assert.equal(JSON.parse(context.doPost({postData:{contents}})).ok,true);
 assert.equal(JSON.parse(context.doPost({postData:{contents}})).ok,true);
 assert.equal(rows.length,2);assert.ok(rows[1][3].startsWith("'="));
});

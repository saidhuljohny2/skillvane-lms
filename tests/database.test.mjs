import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Execute the real migration functions against an isolated PostgreSQL engine.
// Auth schemas/roles are fixtures; pgcrypto's UUID function is built into PG.
test('database migration: atomic payment, retry leases and certificate eligibility', async () => {
 const db = new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
   create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}'::jsonb);
   create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;`);
  for (const file of (await fs.readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) {
   const sql = (await fs.readFile('supabase/migrations/'+file,'utf8')).replace('create extension if not exists pgcrypto;', '');
   await db.exec(sql);
  }
  const uid='11111111-1111-4111-8111-111111111111';
  await db.query(`insert into auth.users(id,email,raw_user_meta_data) values($1,'learner@example.test','{"full_name":"Actual Student"}')`,[uid]);
  await db.query(`insert into public.payment_orders(order_id,student_id,student_email,course_ids,amount_paise) values('order_test',$1,'learner@example.test',array['python-de','project-healthcare'],101)`,[uid]);
  const complete = () => db.query(`select public.complete_payment_enrollment('order_test','pay_test',$1)`,[uid]);
  await complete();
  const firstDate=(await db.query(`select verified_at from payment_orders where order_id='order_test'`)).rows[0].verified_at;
  assert.equal(Number((await db.query('select sum(amount_paid_paise) total from enrollments')).rows[0].total),101);
  assert.equal((await db.query('select count(*)::int n from delivery_jobs')).rows[0].n,3);
  await complete();
  assert.deepEqual((await db.query(`select verified_at from payment_orders where order_id='order_test'`)).rows[0].verified_at,firstDate);
  assert.equal((await db.query('select count(*)::int n from delivery_jobs')).rows[0].n,3);
  await assert.rejects(db.query(`select public.complete_payment_enrollment('order_test','pay_different',$1)`,[uid]),/already completed/);
  // Unique provider payment prevents a second order's enrollment and jobs committing.
  await db.query(`insert into payment_orders(order_id,student_id,student_email,course_ids,amount_paise) values('order_rollback',$1,'learner@example.test',array['project-traffic'],99)`,[uid]);
  await assert.rejects(db.query(`select public.complete_payment_enrollment('order_rollback','pay_test',$1)`,[uid]));
  assert.equal((await db.query(`select count(*)::int n from enrollments where course_id='project-traffic'`)).rows[0].n,0);
  assert.equal((await db.query(`select count(*)::int n from delivery_jobs where order_id='order_rollback'`)).rows[0].n,0);
  const lease=(await db.query(`select * from public.claim_delivery_jobs('order_test',1)`)).rows[0];
  assert.equal(lease.status,'processing'); assert.equal(lease.attempts,1); assert.ok(lease.lease_token);
  const others=(await db.query(`select * from public.claim_delivery_jobs('order_test',3)`)).rows;
  assert.equal(others.length,2); assert.ok(others.every(j=>j.id!==lease.id));
  assert.equal((await db.query(`select * from public.claim_delivery_jobs('order_test',3)`)).rows.length,0);
  await db.query(`update delivery_jobs set locked_until=now()-interval '1 second' where id=$1`,[lease.id]);
  const renewed=(await db.query(`select * from public.claim_delivery_jobs('order_test',1)`)).rows[0];
  assert.equal(renewed.id,lease.id); assert.notEqual(renewed.lease_token,lease.lease_token);
  await assert.rejects(db.query(`select * from public.issue_student_certificate($1,'project-traffic')`,[uid]),/Enrollment is required/);
  await assert.rejects(db.query(`select * from public.issue_student_certificate($1,'python-de')`,[uid]),/Complete every/);
  await db.query(`insert into learning_progress(student_id,course_id,module_index) select $1,'python-de',n from generate_series(0,3) n`,[uid]);
  const cert=(await db.query(`select * from public.issue_student_certificate($1,'python-de')`,[uid])).rows[0];
  assert.equal(cert.student_name,'Actual Student'); assert.equal(cert.course_name,'Python for Data Engineering');
  assert.equal((await db.query(`select * from public.issue_student_certificate($1,'python-de')`,[uid])).rows[0].id,cert.id);
  assert.equal((await db.query(`select sale_enabled from courses where id='multi-cloud-recordings'`)).rows[0].sale_enabled,false);
  for(const role of ['anon','authenticated']) {
   assert.equal((await db.query(`select has_function_privilege($1,'public.complete_payment_enrollment(text,text,uuid)','execute') ok`,[role])).rows[0].ok,false);
   assert.equal((await db.query(`select has_function_privilege($1,'public.issue_student_certificate(uuid,text)','execute') ok`,[role])).rows[0].ok,false);
  }
 } finally { await db.close(); }
});

// Script Properties: SHEET_WEBHOOK_SECRET, SPREADSHEET_ID, SHEET_NAME (optional).
// Deploy as a web app executing as the sheet owner. Replaces the unsigned browser endpoint.
function doPost(e) {
  const reply = function(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); };
  let lock;
  try {
    const props = PropertiesService.getScriptProperties();
    const envelope = JSON.parse(e.postData.contents);
    const secret = props.getProperty("SHEET_WEBHOOK_SECRET");
    if (!secret || typeof envelope.message !== "string") return reply({ ok: false });
    const expected = Utilities.computeHmacSha256Signature(envelope.message, secret).map(function(b) { return ("0" + ((b+256)%256).toString(16)).slice(-2); }).join("");
    if (expected !== envelope.signature) return reply({ ok: false });
    const data = JSON.parse(envelope.message);
    if (!data.eventId || !Number.isFinite(data.timestamp) || Math.abs(Date.now()-data.timestamp)>300000) return reply({ ok: false });
    lock = LockService.getScriptLock(); lock.waitLock(10000);
    const book = SpreadsheetApp.openById(props.getProperty("SPREADSHEET_ID"));
    const sheet = book.getSheetByName(props.getProperty("SHEET_NAME") || "Enrollments") || book.insertSheet(props.getProperty("SHEET_NAME") || "Enrollments");
    if (!sheet.getLastRow()) sheet.appendRow(["Event ID","Invoice","Payment","Name","Email","Phone","Courses","Amount INR","Paid at"]);
    if (sheet.getLastRow()>1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(data.eventId).matchEntireCell(true).findNext()) return reply({ ok: true });
    const r=data.record;
    const safe=function(value) { const s=String(value == null ? "" : value); return /^\s*[=+@-]/.test(s) ? "'"+s : s; };
    sheet.appendRow([data.eventId,r.invoice_no,r.payment_id,r.name,r.email,r.phone,r.course_name,r.amount,r.paid_at].map(safe));
    return reply({ ok: true });
  } catch(error) { return reply({ ok: false }); }
  finally { if(lock) lock.releaseLock(); }
}

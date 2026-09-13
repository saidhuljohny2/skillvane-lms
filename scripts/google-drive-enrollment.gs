const COURSE_FOLDERS = {
  "gcp-recordings": "1VsxvQYeTeCd1WuDxeDHJ3iQ-HUd9wS-h",
  "python-de": "1Y2XuyAX42D6NEo5bQyD_K2ut2uZmdACk",
  "project-healthcare": "1QO-fMXUP3DGkyJ9SWMfEjmvFGJnnEd4E",
  "project-retail": "1pFg_ZlTOX75ijqYxCusHvcVXmjuLGXlR",
  "project-banking": "1JFILNA36Um1SgUKc9jzjFUhm8PnVzgJX",
  "project-traffic": "19yHS4lPRjX7B7jQdc0O5YUrD2XxrQBHv",
};

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function hex(bytes) {
  return bytes.map(function (byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ("0" + value.toString(16)).slice(-2);
  }).join("");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const secret = PropertiesService.getScriptProperties().getProperty("DRIVE_WEBHOOK_SECRET");
    if (!secret) return jsonResponse({ ok: false, error: "Webhook secret is missing." });

    const email = String(data.email || "").trim().toLowerCase();
    const courseIds = Array.isArray(data.courseIds) ? data.courseIds.map(String) : [];
    const timestamp = Number(data.timestamp || 0);
    if (!email || !courseIds.length || Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
      return jsonResponse({ ok: false, error: "Invalid or expired request." });
    }

    const message = JSON.stringify({ email: email, courseIds: courseIds, timestamp: timestamp });
    const expected = hex(Utilities.computeHmacSha256Signature(message, secret));
    if (expected !== String(data.signature || "")) {
      return jsonResponse({ ok: false, error: "Invalid signature." });
    }

    const folders = [];
    courseIds.forEach(function (courseId) {
      const folderId = COURSE_FOLDERS[courseId];
      if (!folderId) return;
      DriveApp.getFolderById(folderId).addViewer(email);
      folders.push(courseId);
    });
    return jsonResponse({ ok: true, folders: folders });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Drive access update failed." });
  }
}

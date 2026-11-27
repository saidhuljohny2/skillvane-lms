// Deploy as a web app executing as the resource owner. Set DRIVE_WEBHOOK_SECRET
// in Script Properties. Resource IDs come only from the signed server request.
function jsonResponse(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function hex(bytes) { return bytes.map(function(b) { return ("0" + ((b + 256) % 256).toString(16)).slice(-2); }).join(""); }
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty("DRIVE_WEBHOOK_SECRET");
    if (!secret || !Number.isFinite(data.timestamp) || Math.abs(Date.now() - data.timestamp) > 300000 || !Array.isArray(data.courseIds) || !data.courseIds.length || data.courseIds.length > 20) return jsonResponse({ ok: false });
    const message = JSON.stringify({ email: data.email, courseIds: data.courseIds, resources: data.resources, timestamp: data.timestamp });
    if (hex(Utilities.computeHmacSha256Signature(message, secret)) !== data.signature) return jsonResponse({ ok: false });
    const folders = [];
    data.courseIds.forEach(function(id) {
      try {
        const resources = data.resources[id];
        if (!Array.isArray(resources) || !resources.length) return;
        resources.forEach(function(resource) {
          if (!/^[a-zA-Z0-9_-]{10,}$/.test(resource.id)) throw new Error("Invalid resource");
          if (resource.type === "folder") DriveApp.getFolderById(resource.id).addViewer(data.email);
          else if (resource.type === "file") DriveApp.getFileById(resource.id).addViewer(data.email);
          else throw new Error("Invalid resource type");
        });
        folders.push(id);
      } catch (error) { console.error("Grant failed for course " + id); }
    });
    return jsonResponse({ ok: true, folders: folders });
  } catch (error) { return jsonResponse({ ok: false }); }
}

import crypto from "node:crypto";

export async function grantDriveCourseAccess(email, courseIds) {
  const webhookUrl = String(process.env.GOOGLE_DRIVE_ACCESS_WEBHOOK_URL || "").trim();
  const secret = String(process.env.GOOGLE_DRIVE_ACCESS_SECRET || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedCourseIds = [...new Set((courseIds || []).map(String).filter(Boolean))];

  if (!webhookUrl || !secret || !normalizedEmail || !normalizedCourseIds.length) {
    return { configured: Boolean(webhookUrl && secret), granted: false };
  }

  const timestamp = Date.now();
  const message = JSON.stringify({ email: normalizedEmail, courseIds: normalizedCourseIds, timestamp });
  const signature = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ email: normalizedEmail, courseIds: normalizedCourseIds, timestamp, signature }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.ok) {
    throw new Error("Google Drive access could not be granted automatically.");
  }
  return { configured: true, granted: true, folders: payload.folders || [] };
}

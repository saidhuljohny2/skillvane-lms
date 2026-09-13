import crypto from "node:crypto";

async function grantThroughWebhook(webhookUrl, secret, email, courseIds) {
  if (!webhookUrl || !courseIds.length) return [];
  const timestamp = Date.now();
  const message = JSON.stringify({ email, courseIds, timestamp });
  const signature = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ email, courseIds, timestamp, signature }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.ok) {
    throw new Error("Google Drive access could not be granted automatically.");
  }
  return payload.folders || [];
}

export async function grantDriveCourseAccess(email, courseIds) {
  const webhookUrl = String(process.env.GOOGLE_DRIVE_ACCESS_WEBHOOK_URL || "").trim();
  const secret = String(process.env.GOOGLE_DRIVE_ACCESS_SECRET || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedCourseIds = [...new Set((courseIds || []).map(String).filter(Boolean))];

  if (!webhookUrl || !secret || !normalizedEmail || !normalizedCourseIds.length) {
    return { configured: Boolean(secret && webhookUrl), granted: false };
  }

  const folders = await grantThroughWebhook(webhookUrl, secret, normalizedEmail, normalizedCourseIds);
  return { configured: true, granted: true, folders };
}

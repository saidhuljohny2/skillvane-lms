import crypto from "node:crypto";
import { supabaseServiceRequest } from "./supabase.js";

export function driveResource(value) {
  if (!value) return null;
  let url; try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(url.hostname)) return null;
  const folder = url.pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  const file = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = folder?.[1] || file?.[1] || url.searchParams.get("id");
  return id && /^[a-zA-Z0-9_-]{10,}$/.test(id) && !id.includes("REPLACE_WITH") ? { id, type: folder ? "folder" : "file" } : null;
}
export async function grantDriveCourseAccess(email, courseIds) {
  const url = process.env.GOOGLE_DRIVE_ACCESS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_DRIVE_ACCESS_SECRET;
  const ids = [...new Set(courseIds)].filter(id => /^[a-z0-9-]+$/.test(id));
  if (!url || !secret || !email || !ids.length) return { configured: Boolean(url && secret), granted: false, folders: [], errors: {} };
  const rows = await supabaseServiceRequest(`/rest/v1/courses?id=in.(${ids.join(",")})&select=id,delivery_mode,drive_url,notes_url`);
  const resources = {}; const errors = {};
  for (const id of ids) {
    const course = rows.find(row => row.id === id);
    const links = course ? [course.notes_url, ...(course.delivery_mode === "drive" ? [course.drive_url] : [])] : [];
    const parsed = links.map(driveResource);
    if (!parsed.length || parsed.some(item => !item)) { errors[id] = "Course resources have not been configured."; continue; }
    resources[id] = [...new Map(parsed.map(item => [item.id, item])).values()];
  }
  const requested = Object.keys(resources);
  if (!requested.length) return { configured: true, granted: false, folders: [], errors };
  const payload = { email: email.trim().toLowerCase(), courseIds: requested, resources, timestamp: Date.now() };
  const signature = crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
  const result = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ ...payload, signature }), signal: AbortSignal.timeout(12000) });
  const data = await result.json().catch(() => ({}));
  if (!result.ok || !data.ok || !Array.isArray(data.folders)) throw new Error("Google Drive did not confirm resource access.");
  const folders = requested.filter(id => data.folders.includes(id));
  for (const id of requested) if (!folders.includes(id)) errors[id] = "Google Drive did not confirm all resources for this course.";
  return { configured: true, granted: ids.length === folders.length, folders, errors };
}

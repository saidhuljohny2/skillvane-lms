import crypto from "node:crypto";
import { supabaseServiceRequest } from "./supabase.js";
import { grantAndTrackDriveAccess } from "./drive-access-status.js";

async function deliver(job) {
  const orders = await supabaseServiceRequest(`/rest/v1/payment_orders?order_id=eq.${encodeURIComponent(job.order_id)}&select=*`);
  const order = orders[0];
  if (!order || order.status !== "paid") throw new Error("Paid order was not found.");
  const profiles = await supabaseServiceRequest(`/rest/v1/profiles?id=eq.${order.student_id}&select=full_name,email,phone`);
  const profile = profiles[0];
  if (!profile?.email) throw new Error("Student profile was not found.");
  if (job.kind === "drive") {
    const result = await grantAndTrackDriveAccess(order.student_id, profile.email, order.course_ids);
    if (!result.granted) throw new Error("Drive access is incomplete. Check course resources and integration settings.");
    return;
  }
  const courses = await supabaseServiceRequest(`/rest/v1/courses?id=in.(${order.course_ids.map(encodeURIComponent).join(",")})&select=id,title`);
  const details = order.invoice_details || {};
  const record = {
    invoice_no: `SV-${order.order_id}`, payment_id: order.payment_id,
    to_name: profile.full_name, to_email: order.student_email, name: profile.full_name, email: order.student_email, phone: profile.phone,
    course_name: courses.map(course => course.title).join(", "), course_id: order.course_ids.join(","),
    amount: (order.amount_paise / 100).toFixed(2), amount_paise: order.amount_paise,
    original_amount: details.original_amount ?? order.amount_paise / 100, discount_amount: details.discount_amount ?? 0,
    multi_course_discount: details.multi_course_discount ?? 0, coupon_code: details.coupon_code || "No coupon",
    paid_at: order.verified_at, academy_name: "SkillVane IT Academy",
  };
  if (job.kind === "invoice") {
    const { EMAILJS_SERVICE_ID: service_id, EMAILJS_INVOICE_TEMPLATE_ID: template_id, EMAILJS_PUBLIC_KEY: user_id, EMAILJS_PRIVATE_KEY: accessToken } = process.env;
    if (!service_id || !template_id || !user_id || !accessToken) throw new Error("Server invoice email is not configured.");
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id, template_id, user_id, accessToken, template_params: record }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Invoice email provider returned HTTP ${response.status}.`);
  } else if (job.kind === "sheet") {
    const url = process.env.GOOGLE_SHEET_WEBHOOK_URL; const secret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET;
    if (!url || !secret) throw new Error("Signed Google Sheets delivery is not configured.");
    const message = JSON.stringify({ eventId: job.id, record, timestamp: Date.now() });
    const signature = crypto.createHmac("sha256", secret).update(message).digest("hex");
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ message, signature }), signal: AbortSignal.timeout(10000) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) throw new Error("Google Sheets did not confirm delivery.");
  } else throw new Error("Unknown delivery type.");
}

export async function processDeliveryJobs(orderId = null, limit = 3) {
  const jobs = await supabaseServiceRequest("/rest/v1/rpc/claim_delivery_jobs", { method: "POST", body: JSON.stringify({ p_order_id: orderId, p_limit: limit }) });
  const results = [];
  for (const job of jobs) {
    let values;
    try { await deliver(job); values = { status: "sent", completed_at: new Date().toISOString(), last_error: null }; }
    catch (error) {
      values = { status: "failed", last_error: String(error.message).slice(0, 300), next_attempt_at: new Date(Date.now() + Math.min(86400, 60 * 2 ** Math.min(job.attempts, 10)) * 1000).toISOString() };
    }
    await supabaseServiceRequest(`/rest/v1/delivery_jobs?id=eq.${job.id}&lease_token=eq.${job.lease_token}`, {
      method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ ...values, locked_until: null, lease_token: null }),
    });
    results.push({ id: job.id, kind: job.kind, status: values.status });
  }
  return results;
}

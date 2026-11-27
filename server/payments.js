import { waitUntil } from "@vercel/functions";
import crypto from "node:crypto";
import { supabaseServiceRequest } from "./supabase.js";
import { processDeliveryJobs } from "./delivery.js";

export function fail(message, statusCode = 400) { return Object.assign(new Error(message), { statusCode }); }
export function validSignature(body, signature, secret) {
  if (!secret || typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  return crypto.timingSafeEqual(Buffer.from(signature, "hex"), crypto.createHmac("sha256", secret).update(body).digest());
}
export async function razorpayRequest(path) {
  const { RAZORPAY_KEY_ID: id, RAZORPAY_KEY_SECRET: secret } = process.env;
  if (!id || !secret) throw fail("Payments are temporarily unavailable.", 503);
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}` }, signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw fail("Could not confirm payment status. Please try again.", 502);
  return response.json();
}
export async function completeVerifiedPayment(orderId, paymentId, studentId) {
  if (typeof orderId !== "string" || typeof paymentId !== "string" || !/^order_[a-zA-Z0-9]+$/.test(orderId) || !/^pay_[a-zA-Z0-9]+$/.test(paymentId)) throw fail("Invalid payment identifiers.");
  const rows = await supabaseServiceRequest(`/rest/v1/payment_orders?order_id=eq.${encodeURIComponent(orderId)}&select=order_id,student_id,course_ids,amount_paise,status,payment_id`);
  const order = rows[0];
  if (!order || !order.student_id || (studentId && order.student_id !== studentId)) throw fail("This payment does not belong to your account.", 403);
  if (order.status === "paid" && order.payment_id !== paymentId) throw fail("This order was already completed with another payment.", 409);
  const payment = await razorpayRequest(`/payments/${encodeURIComponent(paymentId)}`);
  if (payment.id !== paymentId || payment.order_id !== orderId || payment.amount !== order.amount_paise || payment.currency !== "INR") throw fail("Payment details do not match the order.", 409);
  if (payment.status !== "captured" || payment.captured !== true) throw fail("Payment is awaiting capture. Course access will activate once capture is confirmed.", 409);
  const courseIds = await supabaseServiceRequest("/rest/v1/rpc/complete_payment_enrollment", {
    method: "POST", body: JSON.stringify({ p_order_id: orderId, p_payment_id: paymentId, p_student_id: order.student_id }),
  });
  // Completion and the durable delivery queue commit together. A provider outage
  // must not turn an already completed payment into a checkout error.
  const delivery = processDeliveryJobs(orderId).catch(error => console.error("Delivery remains queued", error.message));
  if (process.env.VERCEL) waitUntil(delivery);
  else await delivery;
  return { verified: true, courseIds, invoiceNo: `SV-${orderId}`, deliveryQueued: true };
}

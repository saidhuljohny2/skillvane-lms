import { requireSupabaseUser, supabaseServiceRequest } from "../server/supabase.js";

function recordEvent(studentId, eventType, context = {}) {
  return supabaseServiceRequest("/rest/v1/app_events", {
    method: "POST", headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ student_id: studentId, event_type: eventType, context }),
  }).catch((error) => console.error("Could not record app event", error));
}

async function recoverPayments(user) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Payment recovery is temporarily unavailable.");
  const orders = await supabaseServiceRequest(`/rest/v1/payment_orders?student_id=eq.${encodeURIComponent(user.id)}&status=eq.created&select=order_id,course_ids&order=created_at.desc&limit=10`);
  for (const order of orders) {
    const result = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(order.order_id)}/payments`, { headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` } });
    const payload = await result.json().catch(() => ({}));
    const payment = payload?.items?.find((item) => item.status === "captured");
    if (!payment) continue;
    const courseIds = Array.isArray(order.course_ids) ? order.course_ids : [];
    await supabaseServiceRequest("/rest/v1/enrollments?on_conflict=student_id,course_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(courseIds.map((courseId) => ({ student_id: user.id, course_id: courseId, payment_id: payment.id, amount_paid_paise: Math.round(payment.amount / Math.max(courseIds.length, 1)) }))) });
    await supabaseServiceRequest(`/rest/v1/payment_orders?order_id=eq.${encodeURIComponent(order.order_id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "paid", payment_id: payment.id, verified_at: new Date().toISOString() }) });
    await recordEvent(user.id, "payment_recovered", { order_id: order.order_id, payment_id: payment.id, course_ids: courseIds });
    return { recovered: true, courseIds, paymentId: payment.id };
  }
  await recordEvent(user.id, "payment_recovery_checked", { recovered: false });
  return { recovered: false, courseIds: [] };
}

export default async function handler(request, response) {
  try {
    const user = await requireSupabaseUser(request);
    if (request.method === "GET") {
      const [payments, tickets] = await Promise.all([
        supabaseServiceRequest(`/rest/v1/payment_orders?student_id=eq.${encodeURIComponent(user.id)}&select=order_id,course_ids,amount_paise,payment_id,status,created_at,verified_at&order=created_at.desc`),
        supabaseServiceRequest(`/rest/v1/support_tickets?student_id=eq.${encodeURIComponent(user.id)}&select=id,subject,message,status,created_at,updated_at&order=created_at.desc`).catch(() => []),
      ]);
      return response.status(200).json({ payments, tickets });
    }
    if (request.method === "POST") {
      const action = String(request.body?.action || "");
      if (action === "recover-payment") return response.status(200).json(await recoverPayments(user));
      if (action === "support") {
        const subject = String(request.body?.subject || "").trim();
        const message = String(request.body?.message || "").trim();
        if (subject.length < 3 || message.length < 10) return response.status(400).json({ error: "Please add a subject and at least 10 characters of detail." });
        const rows = await supabaseServiceRequest("/rest/v1/support_tickets", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ student_id: user.id, subject: subject.slice(0, 120), message: message.slice(0, 2000) }) });
        await recordEvent(user.id, "support_created", { ticket_id: rows[0]?.id, subject: subject.slice(0, 120) });
        return response.status(201).json({ ticket: rows[0] });
      }
      return response.status(400).json({ error: "Unknown student action." });
    }
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Student service error", error);
    return response.status(error?.statusCode || 500).json({ error: error instanceof Error ? error.message : "Student services are temporarily unavailable." });
  }
}

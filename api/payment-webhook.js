import { completeVerifiedPayment, validSignature } from "../server/payments.js";
export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== "POST") { response.setHeader("Allow", "POST"); return response.status(405).json({ error: "Method not allowed" }); }
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return response.status(503).json({ error: "Webhook is not configured." });
  try {
    const chunks = []; let length = 0;
    for await (const chunk of request) {
      const bytes = Buffer.from(chunk); length += bytes.length;
      if (length > 1024 * 1024) return response.status(413).json({ error: "Payload too large" });
      chunks.push(bytes);
    }
    const raw = Buffer.concat(chunks);
    if (!validSignature(raw, request.headers["x-razorpay-signature"], process.env.RAZORPAY_WEBHOOK_SECRET)) return response.status(400).json({ error: "Invalid webhook signature" });
    let event;
    try { event = JSON.parse(raw.toString("utf8")); } catch { return response.status(400).json({ error: "Invalid JSON" }); }
    if (!["payment.captured", "order.paid"].includes(event.event)) return response.status(200).json({ ignored: true });
    const payment = event.payload?.payment?.entity;
    await completeVerifiedPayment(payment?.order_id, payment?.id);
    return response.status(200).json({ received: true });
  } catch (error) {
    console.error("Payment webhook failed", error.message);
    return response.status(error.statusCode || 503).json({ error: "Payment processing was not completed. Retry delivery." });
  }
}

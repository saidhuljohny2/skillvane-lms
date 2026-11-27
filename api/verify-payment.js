import { requireSupabaseUser } from "../server/supabase.js";
import { completeVerifiedPayment, validSignature } from "../server/payments.js";

export default async function handler(request, response) {
  if (request.method !== "POST") { response.setHeader("Allow", "POST"); return response.status(405).json({ error: "Method not allowed" }); }
  if (!process.env.RAZORPAY_KEY_SECRET) return response.status(503).json({ error: "Payment verification is unavailable." });
  try {
    const user = await requireSupabaseUser(request);
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = request.body || {};
    if (!validSignature(`${razorpayOrderId}|${razorpayPaymentId}`, razorpaySignature, process.env.RAZORPAY_KEY_SECRET)) return response.status(400).json({ error: "Payment signature is invalid." });
    return response.status(200).json(await completeVerifiedPayment(razorpayOrderId, razorpayPaymentId, user.id));
  } catch (error) { return response.status(error.statusCode || 503).json({ error: error.message }); }
}

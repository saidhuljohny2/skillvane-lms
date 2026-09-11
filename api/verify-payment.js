import crypto from "node:crypto";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return response.status(503).json({ error: "Payment verification is unavailable." });
  }

  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = request.body || {};
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return response.status(400).json({ error: "Incomplete payment response." });
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  const provided = Buffer.from(String(razorpaySignature));
  const expected = Buffer.from(expectedSignature);
  const verified =
    provided.length === expected.length && crypto.timingSafeEqual(provided, expected);

  if (!verified) {
    return response.status(400).json({ error: "Payment signature is invalid." });
  }

  return response.status(200).json({ verified: true });
}

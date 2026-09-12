import { calculateOrderAmount } from "../server/payment-pricing.js";
import { requireSupabaseUser, supabaseServiceRequest } from "../server/supabase.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return response.status(503).json({ error: "Payments are temporarily unavailable." });
  }

  try {
    const user = await requireSupabaseUser(request);
    const courseIds = request.body?.courseIds;
    const amountInRupees = calculateOrderAmount(
      courseIds,
      request.body?.couponCode,
    );
    const receipt = `skillvane_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amountInRupees * 100),
        currency: "INR",
        receipt,
      }),
    });
    const order = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      console.error("Razorpay order creation failed", razorpayResponse.status);
      return response.status(502).json({ error: "Could not start payment. Please try again." });
    }

    await supabaseServiceRequest("/rest/v1/payment_orders", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        order_id: order.id,
        student_id: user.id,
        student_email: user.email,
        course_ids: courseIds,
        amount_paise: order.amount,
      }),
    });

    return response.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    return response.status(error?.statusCode || 400).json({
      error: error instanceof Error ? error.message : "Invalid payment request.",
    });
  }
}

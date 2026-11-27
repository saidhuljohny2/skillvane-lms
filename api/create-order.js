import { driveResource } from "../server/drive-access.js";
import { COURSE_PRICES, MULTI_COURSE_DISCOUNT_PERCENT, MULTI_COURSE_MIN_COUNT } from "../shared/pricing-config.js";
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
    if (courseIds.some(id => typeof id !== "string" || !/^[a-z0-9-]+$/.test(id))) return response.status(400).json({ error: "Invalid course selection." });
    const catalog = await supabaseServiceRequest(`/rest/v1/courses?id=in.(${courseIds.join(",")})&select=id,status,sale_enabled,delivery_mode,drive_url,notes_url,live_url`);
    if (catalog.length !== courseIds.length || catalog.some(course => course.status !== "published" || !course.sale_enabled || !driveResource(course.notes_url) || !(course.delivery_mode === "live" ? /^https:\/\//.test(course.live_url || "") : driveResource(course.drive_url)))) {
      return response.status(409).json({ error: "One or more courses are not currently available for enrollment." });
    }
    const originalAmount = courseIds.reduce((sum, id) => sum + COURSE_PRICES[id], 0);
    const multiDiscount = courseIds.length >= MULTI_COURSE_MIN_COUNT ? Math.round(originalAmount * MULTI_COURSE_DISCOUNT_PERCENT / 100) : 0;
    const receipt = `skillvane_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
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
        invoice_details: { original_amount: originalAmount, discount_amount: originalAmount - amountInRupees, multi_course_discount: multiDiscount, coupon_code: originalAmount - multiDiscount > amountInRupees ? String(request.body?.couponCode || "").trim().toUpperCase() : "" },
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

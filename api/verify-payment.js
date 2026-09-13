import crypto from "node:crypto";
import { requireSupabaseUser, supabaseServiceRequest } from "../server/supabase.js";
import { grantAndTrackDriveAccess } from "../server/drive-access-status.js";

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

  let user;
  try {
    user = await requireSupabaseUser(request);
  } catch (error) {
    return response.status(error?.statusCode || 401).json({ error: error.message });
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

  try {
    const orders = await supabaseServiceRequest(
      `/rest/v1/payment_orders?order_id=eq.${encodeURIComponent(razorpayOrderId)}&select=order_id,student_id,course_ids,status,payment_id`,
    );
    const order = orders[0];
    if (!order || order.student_id !== user.id) {
      return response.status(403).json({ error: "This payment does not belong to your account." });
    }
    if (order.status === "paid" && order.payment_id !== razorpayPaymentId) {
      return response.status(409).json({ error: "This order was already completed with another payment." });
    }

    const courseIds = Array.isArray(order.course_ids) ? order.course_ids : [];
    if (!courseIds.length) {
      return response.status(400).json({ error: "No courses were found for this order." });
    }

    await supabaseServiceRequest("/rest/v1/enrollments?on_conflict=student_id,course_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(
        courseIds.map((courseId) => ({ student_id: user.id, course_id: courseId })),
      ),
    });
    await supabaseServiceRequest(
      `/rest/v1/payment_orders?order_id=eq.${encodeURIComponent(razorpayOrderId)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: "paid",
          payment_id: razorpayPaymentId,
          verified_at: new Date().toISOString(),
        }),
      },
    );
    let driveAccess = { configured: false, granted: false };
    try {
      driveAccess = await grantAndTrackDriveAccess(user.id, user.email, courseIds);
    } catch (error) {
      console.error("Drive access grant failed", error);
    }
    return response.status(200).json({ verified: true, courseIds, driveAccess });
  } catch (error) {
    return response.status(503).json({ error: error.message });
  }
}

import { requireSupabaseAdmin, supabaseServiceRequest } from "../server/supabase.js";

function fail(response, error) {
  console.error("Admin API error", error);
  return response.status(error?.statusCode || 500).json({
    error: error?.statusCode ? error.message : "The admin dashboard is temporarily unavailable.",
  });
}

export default async function handler(request, response) {
  try {
    await requireSupabaseAdmin(request);

    if (request.method === "GET") {
      const [profiles, enrollments, progress, payments, courses] = await Promise.all([
        supabaseServiceRequest("/rest/v1/profiles?select=id,email,full_name,phone,created_at&order=created_at.desc"),
        supabaseServiceRequest("/rest/v1/enrollments?select=student_id,course_id,payment_id,amount_paid_paise,enrolled_at&order=enrolled_at.desc"),
        supabaseServiceRequest("/rest/v1/learning_progress?select=student_id,course_id,module_index"),
        supabaseServiceRequest("/rest/v1/payment_orders?select=order_id,student_email,course_ids,amount_paise,payment_id,status,created_at,verified_at&order=created_at.desc"),
        supabaseServiceRequest("/rest/v1/courses?select=id,title,subtitle,status,updated_at&order=title"),
      ]);
      return response.status(200).json({ profiles, enrollments, progress, payments, courses });
    }

    if (request.method === "PATCH") {
      const { id, title, subtitle, status } = request.body || {};
      if (!id || !title || !["draft", "published"].includes(status)) {
        return response.status(400).json({ error: "Valid course details are required." });
      }
      await supabaseServiceRequest(`/rest/v1/courses?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ title: String(title).trim(), subtitle: String(subtitle || "").trim(), status, updated_at: new Date().toISOString() }),
      });
      return response.status(200).json({ saved: true });
    }

    response.setHeader("Allow", "GET, PATCH");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return fail(response, error);
  }
}

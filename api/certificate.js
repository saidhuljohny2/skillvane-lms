import { supabaseServiceRequest } from "../server/supabase.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  const id = String(request.query?.id || "").trim().slice(0, 80);
  if (!id) return response.status(400).json({ valid: false, error: "Certificate ID is required." });
  try {
    const rows = await supabaseServiceRequest(`/rest/v1/certificates?id=eq.${encodeURIComponent(id)}&select=id,student_name,course_name,completion_date,issued_at`);
    if (!rows[0]) return response.status(404).json({ valid: false, error: "Certificate was not found." });
    return response.status(200).json({ valid: true, certificate: rows[0] });
  } catch (error) {
    console.error("Certificate verification error", error);
    return response.status(500).json({ valid: false, error: "Verification is temporarily unavailable." });
  }
}

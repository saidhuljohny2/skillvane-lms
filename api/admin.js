import { requireSupabaseAdmin, supabaseServiceRequest } from "../server/supabase.js";
import { grantAndTrackDriveAccess } from "../server/drive-access-status.js";

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
      const [profiles, enrollments, progress, payments, driveAccess, courses, modules, lessons, resources, supportTickets, events] = await Promise.all([
        supabaseServiceRequest("/rest/v1/profiles?select=id,email,full_name,phone,created_at&order=created_at.desc"),
        supabaseServiceRequest("/rest/v1/enrollments?select=student_id,course_id"),
        supabaseServiceRequest("/rest/v1/learning_progress?select=student_id,course_id,module_index"),
        supabaseServiceRequest("/rest/v1/payment_orders?select=order_id,student_email,course_ids,amount_paise,payment_id,status,created_at,verified_at&order=created_at.desc"),
        supabaseServiceRequest("/rest/v1/drive_access_grants?select=student_id,course_id,status,last_error,attempted_at,granted_at,updated_at").catch(() => []),
        supabaseServiceRequest("/rest/v1/courses?select=id,title,subtitle,status,updated_at&order=title"),
        supabaseServiceRequest("/rest/v1/course_modules?select=id,course_id,title,position&order=course_id,position"),
        supabaseServiceRequest("/rest/v1/course_lessons?select=id,module_id,title,description,video_url,duration_seconds,position,is_preview,is_published&order=module_id,position"),
        supabaseServiceRequest("/rest/v1/lesson_resources?select=id,lesson_id,title,resource_url,resource_type,position&order=lesson_id,position"),
        supabaseServiceRequest("/rest/v1/support_tickets?select=id,student_id,subject,message,status,created_at,updated_at&order=created_at.desc").catch(() => []),
        supabaseServiceRequest("/rest/v1/app_events?select=id,student_id,event_type,context,created_at&order=created_at.desc&limit=100").catch(() => []),
      ]);
      return response.status(200).json({ profiles, enrollments, progress, payments, driveAccess, courses, modules, lessons, resources, supportTickets, events });
    }

    if (request.method === "POST") {
      const { entity, values } = request.body || {};
      if (entity === "enrollment") {
        const studentId = String(values?.student_id || "").trim();
        const courseId = String(values?.course_id || "").trim();
        if (!studentId || !courseId) return response.status(400).json({ error: "Student and course are required." });
        const rows = await supabaseServiceRequest("/rest/v1/enrollments?on_conflict=student_id,course_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: JSON.stringify({ student_id: studentId, course_id: courseId }),
        });
        const profiles = await supabaseServiceRequest(
          `/rest/v1/profiles?id=eq.${encodeURIComponent(studentId)}&select=email`,
        );
        let driveAccess = { configured: false, granted: false };
        try {
          driveAccess = await grantAndTrackDriveAccess(studentId, profiles[0]?.email, [courseId]);
        } catch (error) {
          console.error("Drive access grant failed", error);
        }
        return response.status(201).json({ item: rows[0], driveAccess });
      }
      if (entity === "drive_access") {
        const studentId = String(values?.student_id || "").trim();
        const courseId = String(values?.course_id || "").trim();
        if (!studentId || !courseId) return response.status(400).json({ error: "Student and course are required." });
        const profiles = await supabaseServiceRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(studentId)}&select=email`);
        if (!profiles[0]?.email) return response.status(404).json({ error: "Student was not found." });
        const driveAccess = await grantAndTrackDriveAccess(studentId, profiles[0].email, [courseId]);
        return response.status(200).json({ driveAccess });
      }
      const tables = { module: "course_modules", lesson: "course_lessons", resource: "lesson_resources" };
      const table = tables[entity];
      if (!table || !values || typeof values !== "object") return response.status(400).json({ error: "Valid content is required." });
      const rows = await supabaseServiceRequest(`/rest/v1/${table}`, {
        method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(values),
      });
      return response.status(201).json({ item: rows[0] });
    }

    if (request.method === "PATCH") {
      const { entity = "course", id, values } = request.body || {};
      const tables = { course: "courses", module: "course_modules", lesson: "course_lessons", resource: "lesson_resources", support_ticket: "support_tickets" };
      const table = tables[entity];
      if (!table || !id || !values || typeof values !== "object") return response.status(400).json({ error: "Valid content details are required." });
      const allowed = {
        course: ["title", "subtitle", "status"], module: ["title", "position"],
        lesson: ["title", "description", "video_url", "duration_seconds", "position", "is_preview", "is_published"],
        resource: ["title", "resource_url", "resource_type", "position"], support_ticket: ["status"],
      }[entity];
      const safeValues = Object.fromEntries(Object.entries(values).filter(([key]) => allowed.includes(key)));
      if (!Object.keys(safeValues).length) return response.status(400).json({ error: "No editable fields were provided." });
      await supabaseServiceRequest(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(entity === "course" ? { ...safeValues, updated_at: new Date().toISOString() } : safeValues),
      });
      return response.status(200).json({ saved: true });
    }

    if (request.method === "DELETE") {
      const { entity, id } = request.body || {};
      const tables = { module: "course_modules", lesson: "course_lessons", resource: "lesson_resources" };
      const table = tables[entity];
      if (!table || !id) return response.status(400).json({ error: "Valid content selection is required." });
      await supabaseServiceRequest(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
      return response.status(200).json({ deleted: true });
    }

    response.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return fail(response, error);
  }
}

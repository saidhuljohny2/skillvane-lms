import { processDeliveryJobs } from "../server/delivery.js";
import { driveResource } from "../server/drive-access.js";
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
      const [profiles, enrollments, progress, payments, driveAccess, courses, modules, lessons, resources, supportTickets, events, announcements, certificates, deliveries] = await Promise.all([
        supabaseServiceRequest("/rest/v1/profiles?select=id,email,full_name,phone,created_at&order=created_at.desc"),
        supabaseServiceRequest("/rest/v1/enrollments?select=student_id,course_id,payment_id,amount_paid_paise,enrolled_at"),
        supabaseServiceRequest("/rest/v1/learning_progress?select=student_id,course_id,module_index"),
        supabaseServiceRequest("/rest/v1/payment_orders?select=order_id,student_email,course_ids,amount_paise,payment_id,status,created_at,verified_at&order=created_at.desc"),
        supabaseServiceRequest("/rest/v1/drive_access_grants?select=student_id,course_id,status,last_error,attempted_at,granted_at,updated_at").catch(() => []),
        supabaseServiceRequest("/rest/v1/courses?select=id,title,subtitle,status,updated_at,delivery_mode,drive_url,notes_url,live_url,sale_enabled,certificate_module_count&order=title"),
        supabaseServiceRequest("/rest/v1/course_modules?select=id,course_id,title,position&order=course_id,position"),
        supabaseServiceRequest("/rest/v1/course_lessons?select=id,module_id,title,description,video_url,duration_seconds,position,is_preview,is_published&order=module_id,position"),
        supabaseServiceRequest("/rest/v1/lesson_resources?select=id,lesson_id,title,resource_url,resource_type,position&order=lesson_id,position"),
        supabaseServiceRequest("/rest/v1/support_tickets?select=id,student_id,subject,message,status,created_at,updated_at&order=created_at.desc").catch(() => []),
        supabaseServiceRequest("/rest/v1/app_events?select=id,student_id,event_type,context,created_at&order=created_at.desc&limit=100").catch(() => []),
        supabaseServiceRequest("/rest/v1/announcements?select=id,title,message,course_id,is_published,created_at&order=created_at.desc").catch(() => []),
        supabaseServiceRequest("/rest/v1/certificates?select=id,student_id,student_name,course_id,course_name,completion_date,issued_at&order=issued_at.desc").catch(() => []),
        supabaseServiceRequest("/rest/v1/delivery_jobs?select=id,order_id,kind,status,attempts,last_error,next_attempt_at&status=neq.sent&order=created_at.desc&limit=100"),
      ]);
      return response.status(200).json({ profiles, enrollments, progress, payments, driveAccess, courses, modules, lessons, resources, supportTickets, events, announcements, certificates, deliveries });
    }

    if (request.method === "POST") {
      const { entity, values } = request.body || {};
      if (entity === "retry_delivery") {
        const id = String(values?.id || "");
        if (!/^[0-9a-f-]{36}$/i.test(id)) return response.status(400).json({ error: "Select a delivery to retry." });
        const rows = await supabaseServiceRequest(`/rest/v1/delivery_jobs?id=eq.${id}&select=order_id`);
        if (!rows[0]) return response.status(404).json({ error: "Delivery not found." });
        await supabaseServiceRequest(`/rest/v1/delivery_jobs?id=eq.${id}&status=in.(failed,pending)`, { method: "PATCH", body: JSON.stringify({ next_attempt_at: new Date().toISOString() }) });
        return response.status(200).json({ results: await processDeliveryJobs(rows[0].order_id) });
      }

      if (entity === "student_invite" || entity === "student_password_reset") {
        // Use a configured destination, never a redirect supplied by the browser.
        const siteUrl = new URL(process.env.SITE_URL || "https://skillvane.vercel.app");
        if (siteUrl.protocol !== "https:" && siteUrl.hostname !== "localhost") throw new Error("SITE_URL must use HTTPS.");
        let email;
        if (entity === "student_password_reset") {
          const studentId = String(values?.student_id || "");
          if (!/^[0-9a-f-]{36}$/i.test(studentId)) return response.status(400).json({ error: "A valid student is required." });
          const profiles = await supabaseServiceRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(studentId)}&select=email,role`);
          if (!profiles[0] || profiles[0].role !== "student") return response.status(404).json({ error: "Student was not found." });
          email = profiles[0].email;
        } else {
          email = String(values?.email || "").trim().toLowerCase();
          if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ error: "Enter a valid email address." });
        }
        const redirect = new URL(entity === "student_invite" ? "/?auth-callback=invite" : "/?password-recovery=1&login=student", siteUrl);
        const endpoint = entity === "student_invite" ? "invite" : "recover";
        await supabaseServiceRequest(`/auth/v1/${endpoint}?redirect_to=${encodeURIComponent(redirect.href)}`, {
          method: "POST",
          body: JSON.stringify({ email, ...(entity === "student_invite" ? { data: { full_name: String(values?.full_name || "").trim().slice(0, 120) } } : {}) }),
        });
        return response.status(200).json({ sent: true });
      }

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
      if (entity === "certificate") {
        const studentName = String(values?.student_name || "").trim().slice(0, 120);
        const courseId = String(values?.course_id || "").trim().slice(0, 100);
        const courseName = String(values?.course_name || "").trim().slice(0, 160);
        const completionDate = String(values?.completion_date || "").trim();
        if (studentName.length < 2 || !courseId || !courseName || !/^\d{4}-\d{2}-\d{2}$/.test(completionDate) || Number.isNaN(Date.parse(`${completionDate}T00:00:00Z`))) {
          return response.status(400).json({ error: "Enter a recipient name, course, and valid completion date." });
        }
        const certificateId = `SV-${courseId.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
        const rows = await supabaseServiceRequest("/rest/v1/certificates", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ id: certificateId, student_id: null, student_name: studentName, course_id: courseId, course_name: courseName, completion_date: completionDate, issued_at: new Date().toISOString() }),
        });
        return response.status(201).json({ certificate: rows[0] || { id: certificateId } });
      }
      const tables = { module: "course_modules", lesson: "course_lessons", resource: "lesson_resources", announcement: "announcements" };
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
        course: ["title", "subtitle", "status", "delivery_mode", "drive_url", "notes_url", "live_url", "sale_enabled", "certificate_module_count"], module: ["title", "position"],
        lesson: ["title", "description", "video_url", "duration_seconds", "position", "is_preview", "is_published"],
        resource: ["title", "resource_url", "resource_type", "position"], support_ticket: ["status"],
      }[entity];
      const safeValues = Object.fromEntries(Object.entries(values).filter(([key]) => allowed.includes(key)));
      if (entity === "course") {
        const rows = await supabaseServiceRequest(`/rest/v1/courses?id=eq.${encodeURIComponent(id)}&select=*`);
        if (!rows[0]) return response.status(404).json({ error: "Course not found." });
        const next = { ...rows[0], ...safeValues };
        for (const key of ["drive_url", "notes_url"]) {
          if (next[key] && !driveResource(next[key])) return response.status(400).json({ error: "Use a valid Google Drive folder or file link." });
        }
        if (next.live_url) {
          let url; try { url = new URL(next.live_url); } catch { return response.status(400).json({ error: "Use a valid live-session URL." }); }
          if (url.protocol !== "https:") return response.status(400).json({ error: "Live-session links must use HTTPS." });
        }
        if (!Number.isInteger(next.certificate_module_count) || next.certificate_module_count < 1) return response.status(400).json({ error: "Set the number of required certificate modules." });
        if (next.sale_enabled && (!next.notes_url || !(next.delivery_mode === "live" ? next.live_url : next.drive_url))) return response.status(400).json({ error: "Configure course resources before enabling enrollment." });
      }
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

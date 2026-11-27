import { grantDriveCourseAccess } from "./drive-access.js";
import { supabaseServiceRequest } from "./supabase.js";

async function saveStatus(studentId, courseIds, status, error = null) {
  const now = new Date().toISOString();
  await supabaseServiceRequest("/rest/v1/drive_access_grants?on_conflict=student_id,course_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(courseIds.map((courseId) => ({
      student_id: studentId,
      course_id: courseId,
      status,
      last_error: error,
      attempted_at: now,
      granted_at: status === "granted" ? now : null,
      updated_at: now,
    }))),
  });
}

export async function grantAndTrackDriveAccess(studentId, email, courseIds) {
  try {
    const result = await grantDriveCourseAccess(email, courseIds);
    try {
      for (const courseId of courseIds) {
        const granted = result.folders?.includes(courseId);
        await saveStatus(studentId, [courseId], granted ? "granted" : result.configured ? "failed" : "pending", granted ? null : result.errors?.[courseId] || "Drive integration is not configured.");
      }
    } catch (trackingError) {
      console.error("Drive access status could not be saved", trackingError);
    }
    return result;
  } catch (error) {
    try {
      await saveStatus(studentId, courseIds, "failed", error instanceof Error ? error.message : "Drive access failed");
    } catch (trackingError) {
      console.error("Drive access failure status could not be saved", trackingError);
    }
    throw error;
  }
}

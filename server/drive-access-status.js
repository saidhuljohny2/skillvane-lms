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
    const status = result.granted ? "granted" : "pending";
    try {
      await saveStatus(studentId, courseIds, status);
    } catch (trackingError) {
      console.error("Drive access was completed but its status could not be saved", trackingError);
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

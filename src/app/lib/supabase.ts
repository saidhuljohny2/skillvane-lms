const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "");
const sessionKey = "skillvane_supabase_session";

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  user: SupabaseUser;
}

export interface AuthenticatedStudent {
  email: string;
  name: string;
  phone: string;
  enrolledCourses: string[];
}

export const isSupabaseConfigured = Boolean(supabaseUrl && anonKey);

function authHeaders(accessToken?: string) {
  return {
    apikey: anonKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "Content-Type": "application/json",
  };
}

async function request<T>(path: string, init: RequestInit = {}, accessToken?: string) {
  if (!isSupabaseConfigured) throw new Error("Student login is being configured. Please try again shortly.");
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: { ...authHeaders(accessToken), ...(init.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.msg || payload?.message || payload?.error_description || payload?.error;
    throw new Error(message || "Unable to complete the request.");
  }
  return payload as T;
}

function persistSession(session: SupabaseSession | null) {
  if (session) localStorage.setItem(sessionKey, JSON.stringify(session));
  else localStorage.removeItem(sessionKey);
}

function normalizeSession(payload: SupabaseSession): SupabaseSession {
  const expiresAt = payload.expires_at || Math.floor(Date.now() / 1000) + (payload.expires_in || 3600);
  return { ...payload, expires_at: expiresAt };
}

export async function signUpStudent(email: string, password: string, fullName: string, phone: string) {
  const payload = await request<{ user: SupabaseUser; session?: SupabaseSession | null }>("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, data: { full_name: fullName, phone } }),
  });
  if (payload.session) persistSession(normalizeSession(payload.session));
  return payload;
}

export async function signInStudent(email: string, password: string) {
  const session = normalizeSession(await request<SupabaseSession>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }));
  persistSession(session);
  return loadAuthenticatedStudent(session);
}

export async function sendPasswordReset(email: string) {
  await request("/auth/v1/recover", {
    method: "POST",
    body: JSON.stringify({ email, redirect_to: `${window.location.origin}/` }),
  });
}

export async function signOutStudent() {
  const session = readStoredSession();
  persistSession(null);
  if (!session) return;
  await request("/auth/v1/logout", { method: "POST" }, session.access_token).catch(() => undefined);
}

function readStoredSession(): SupabaseSession | null {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch {
    persistSession(null);
    return null;
  }
}

async function refreshSession(session: SupabaseSession) {
  const refreshed = normalizeSession(await request<SupabaseSession>("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  }));
  persistSession(refreshed);
  return refreshed;
}

export async function getValidAccessToken() {
  return (await getValidSession()).access_token;
}

async function getValidSession() {
  let session = readStoredSession();
  if (!session) throw new Error("Please sign in before enrolling.");
  if (!session.expires_at || session.expires_at <= Math.floor(Date.now() / 1000) + 60) {
    session = await refreshSession(session);
  }
  return session;
}

export async function loadLearningProgress() {
  const session = await getValidSession();
  const rows = await request<Array<{ course_id: string; module_index: number }>>(
    "/rest/v1/learning_progress?select=course_id,module_index&order=course_id,module_index",
    {},
    session.access_token,
  );
  return rows.reduce<Record<string, number[]>>((progress, row) => {
    (progress[row.course_id] ||= []).push(row.module_index);
    return progress;
  }, {});
}

export async function setLearningModuleComplete(
  courseId: string,
  moduleIndex: number,
  completed: boolean,
) {
  const session = await getValidSession();
  if (completed) {
    await request(
      "/rest/v1/learning_progress",
      {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify({
          student_id: session.user.id,
          course_id: courseId,
          module_index: moduleIndex,
        }),
      },
      session.access_token,
    );
    return;
  }

  await request(
    `/rest/v1/learning_progress?student_id=eq.${encodeURIComponent(session.user.id)}&course_id=eq.${encodeURIComponent(courseId)}&module_index=eq.${moduleIndex}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
    session.access_token,
  );
}

async function loadAuthenticatedStudent(session: SupabaseSession): Promise<AuthenticatedStudent> {
  const userId = encodeURIComponent(session.user.id);
  const [profiles, enrollments] = await Promise.all([
    request<Array<{ email: string; full_name: string; phone: string }>>(
      `/rest/v1/profiles?id=eq.${userId}&select=email,full_name,phone`, {}, session.access_token,
    ),
    request<Array<{ course_id: string }>>(
      `/rest/v1/enrollments?student_id=eq.${userId}&select=course_id`, {}, session.access_token,
    ),
  ]);
  const profile = profiles[0];
  return {
    email: profile?.email || session.user.email || "",
    name: profile?.full_name || String(session.user.user_metadata?.full_name || "Student"),
    phone: profile?.phone || String(session.user.user_metadata?.phone || ""),
    enrolledCourses: enrollments.map((row) => row.course_id),
  };
}

export async function restoreStudentSession() {
  if (!isSupabaseConfigured) return null;
  let session = readStoredSession();
  if (!session) return null;
  try {
    if (!session.expires_at || session.expires_at <= Math.floor(Date.now() / 1000) + 60) {
      session = await refreshSession(session);
    }
    return await loadAuthenticatedStudent(session);
  } catch {
    persistSession(null);
    return null;
  }
}

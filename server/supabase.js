function getConfig() {
  const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const publishableKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publishableKey || !serviceKey) {
    throw new Error("Supabase server configuration is incomplete.");
  }
  return { url, publishableKey, serviceKey };
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Supabase request failed", response.status, payload?.code || payload?.message || "unknown");
    throw new Error("The enrollment database is temporarily unavailable.");
  }
  return payload;
}

export async function requireSupabaseUser(request) {
  const { url, publishableKey } = getConfig();
  const authorization = request.headers?.authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    const error = new Error("Please sign in before enrolling.");
    error.statusCode = 401;
    throw error;
  }
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: authorization },
  });
  if (!response.ok) {
    const error = new Error("Your login session expired. Please sign in again.");
    error.statusCode = 401;
    throw error;
  }
  return response.json();
}

export async function requireSupabaseAdmin(request) {
  const user = await requireSupabaseUser(request);
  const rows = await supabaseServiceRequest(
    `/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role`,
  );
  if (rows[0]?.role !== "admin") {
    const error = new Error("Administrator access is required.");
    error.statusCode = 403;
    throw error;
  }
  return user;
}

export async function supabaseServiceRequest(path, init = {}) {
  const { url, serviceKey } = getConfig();
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  return parseResponse(response);
}

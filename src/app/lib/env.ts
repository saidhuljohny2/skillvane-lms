import { z } from "zod";

const publicEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const parsed = publicEnvSchema.safeParse(import.meta.env);

if (!parsed.success && import.meta.env.DEV) {
  console.warn("Invalid public environment configuration", parsed.error.flatten());
}

export const env = parsed.success
  ? parsed.data
  : {
      VITE_SUPABASE_URL: undefined,
      VITE_SUPABASE_ANON_KEY: undefined,
    };

export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY,
);

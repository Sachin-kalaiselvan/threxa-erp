import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when both env vars are present. The app gates rendering on this
 * flag (see App.tsx) instead of making the client nullable, so every
 * page can keep calling `supabase.from(...)` without null checks.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Always a real client. When env vars are missing we fall back to a
 * placeholder so module evaluation never crashes — but the app never
 * actually calls it in that state, because App.tsx short-circuits to
 * the "not configured" screen first.
 */
export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key"
);

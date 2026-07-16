import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly during setup instead of mysterious network errors later
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Set them in Vercel > Project > Settings > Environment Variables."
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");

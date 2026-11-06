import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

// Supabase client for Client Components. Auth is wired in Phase 2.
export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = publicEnv();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

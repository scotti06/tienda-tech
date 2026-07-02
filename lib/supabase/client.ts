import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }
  return url;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return key;
}

export function createBrowserClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getAnonKey());
}

let browserClient: SupabaseClient | undefined;

/** Singleton anon client for browser usage. */
export function getBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient();
  }
  return browserClient;
}

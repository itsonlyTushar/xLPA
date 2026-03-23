import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!supabaseUrl;

/**
 * Creates a Supabase client configured to inject the Clerk session token
 * into the Authorization header, allowing Supabase RLS to authenticate the user.
 */
export function createClerkSupabaseClient(session: any) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: async () => {
      return (await session?.getToken({ template: "supabase" })) ?? "";
    },
  });
}

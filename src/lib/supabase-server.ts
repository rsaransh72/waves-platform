import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components cannot refresh cookies while rendering.
          }
        },
      },
    }
  );
}

// Server actions are callable by anyone who can load the page, so each one that
// touches platform data must call this before doing any work.
export async function requirePlatformAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Sign in to a platform administrator account.");

  const { data: isPlatformAdmin, error: roleError } = await supabase.rpc("is_platform_admin");
  if (roleError || !isPlatformAdmin) throw new Error("Only platform administrators can perform this action.");

  return { supabase, user };
}
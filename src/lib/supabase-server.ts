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

export type SessionUser = { id: string; email: string; name: string | null };

// The signed-in user, read from the session's access token. getClaims() checks the
// token's ES256 signature against the project's public keys locally, so unlike
// getUser() it does not call Supabase Auth on every page load. Use getUser() where a
// revoked session must be refused immediately (server actions changing data).
export async function getSessionUser(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>): Promise<SessionUser | null> {
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;
  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const name = [metadata.full_name, metadata.name].find((value): value is string => typeof value === "string" && value.trim() !== "");
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : "", name: name?.trim() ?? null };
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
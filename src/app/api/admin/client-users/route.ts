import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { workspaceLabel } from "@/lib/product-workspaces";
import { hasActivatedAccount } from "@/lib/client-members";

type AuthUser = {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  banned_until?: string;
  user_metadata?: Record<string, unknown>;
};

function metadataName(user: AuthUser) {
  const metadata = user.user_metadata ?? {};
  const fullName = metadata.full_name ?? metadata.name;
  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();

  const firstName = typeof metadata.first_name === "string" ? metadata.first_name : "";
  const lastName = typeof metadata.last_name === "string" ? metadata.last_name : "";
  return `${firstName} ${lastName}`.trim() || "Name not set";
}

export async function GET() {
  const sessionClient = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Sign in to a platform administrator account." }, { status: 401 });
  }

  const { data: isPlatformAdmin, error: roleError } = await sessionClient.rpc("is_platform_admin");
  if (roleError || !isPlatformAdmin) {
    return NextResponse.json({ error: "Only platform administrators can view client users." }, { status: 403 });
  }

  let adminClient;
  try {
    adminClient = createSupabaseAdminClient();
  } catch (error) {
    console.error("Client user directory is not configured:", error);
    return NextResponse.json({ error: "User directory requires the server-only Supabase service-role key." }, { status: 503 });
  }

  const [membershipsResult, organizationsResult] = await Promise.all([
    adminClient.from("organization_members").select("user_id, organization_id, role, created_at"),
    adminClient.from("organizations").select("id, name, slug, type, status").order("name"),
  ]);

  const queryError = membershipsResult.error || organizationsResult.error;
  if (queryError) {
    console.error("Client user directory query failed:", queryError);
    return NextResponse.json({ error: "Could not load client memberships. Verify the production schemas and policies." }, { status: 503 });
  }

  const authUsers: AuthUser[] = [];
  const pageSize = 1000;
  for (let page = 1; ; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: pageSize });
    if (error) {
      console.error("Supabase Auth directory query failed:", error);
      return NextResponse.json({ error: "Could not load Supabase Auth accounts." }, { status: 503 });
    }
    authUsers.push(...data.users as AuthUser[]);
    if (data.users.length < pageSize) break;
  }

  const authUsersById = new Map(authUsers.map((authUser) => [authUser.id, authUser]));
  const organizationsById = new Map((organizationsResult.data ?? []).map((organization) => [organization.id, organization]));

  const clientUsers = (membershipsResult.data ?? []).map((membership) => {
    const authUser = authUsersById.get(membership.user_id);
    const organization = organizationsById.get(membership.organization_id);
    return {
      userId: membership.user_id,
      email: authUser?.email ?? null,
      name: authUser ? metadataName(authUser) : "Auth identity unavailable",
      role: membership.role,
      product: organization ? workspaceLabel(organization.type) : "Unknown product",
      clientName: organization?.name ?? "Unknown client",
      clientSlug: organization?.slug ?? "",
      clientStatus: organization?.status ?? "unknown",
      accountStatus: !authUser ? "identity unavailable" : authUser.banned_until ? "restricted" : hasActivatedAccount(authUser) ? "active" : "invited",
      lastSignInAt: authUser?.last_sign_in_at ?? null,
      membershipCreatedAt: membership.created_at,
      canSendReset: Boolean(authUser?.email),
    };
  });

  // Platform staff are managed under Platform Team, not listed as client users.
  const directory = [...clientUsers].sort((left, right) =>
    left.product.localeCompare(right.product)
      || left.clientName.localeCompare(right.clientName)
      || left.name.localeCompare(right.name)
  );

  return NextResponse.json({ users: directory, generatedAt: new Date().toISOString() });
}
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { organizationTypeForProduct } from "@/lib/product-workspaces";
import { friendlyAuthEmailError } from "@/lib/client-members";
import { toStoredPhone } from "@/lib/india";
import { slugError, validateOnboarding, type OnboardingErrors, type OnboardingInput } from "@/lib/client-onboarding";

const SLUG_TAKEN = "Another client already uses this web address. Choose a different one.";
const EMAIL_TAKEN = "This email already has an account, and an account can belong to one organization only. Use a different administrator email.";

const text = (value: unknown) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");

function invalid(error: string, fieldErrors: OnboardingErrors, status = 400) {
  return NextResponse.json({ error, fieldErrors }, { status });
}

async function requirePlatformAdmin() {
  const sessionClient = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return { response: NextResponse.json({ error: "Your session has ended. Sign in again as a platform administrator." }, { status: 401 }) };
  }
  const { data: isPlatformAdmin, error: roleError } = await sessionClient.rpc("is_platform_admin");
  if (roleError || !isPlatformAdmin) {
    return { response: NextResponse.json({ error: "Only active platform administrators can onboard clients." }, { status: 403 }) };
  }
  return { sessionClient };
}

function adminClientOrError() {
  try {
    return { adminClient: createSupabaseAdminClient() };
  } catch (error) {
    console.error("Client onboarding is not configured:", error);
    return { response: NextResponse.json({ error: "Client invitations are not configured. Set the server-only Supabase service-role key." }, { status: 503 }) };
  }
}

// GET ?slug=green-valley: whether a client web address is still free.
export async function GET(request: Request) {
  const auth = await requirePlatformAdmin();
  if ("response" in auth) return auth.response;
  const slug = new URL(request.url).searchParams.get("slug")?.trim().toLowerCase() ?? "";
  const problem = slugError(slug);
  if (problem) return NextResponse.json({ available: false, error: problem });
  const admin = adminClientOrError();
  if ("response" in admin) return admin.response;
  const { adminClient } = admin;
  const { count, error } = await adminClient.from("organizations").select("id", { count: "exact", head: true }).eq("slug", slug);
  if (error) return NextResponse.json({ error: "The web address could not be checked." }, { status: 500 });
  return NextResponse.json({ available: count === 0 });
}

export async function POST(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  if (request.headers.get("origin") !== requestOrigin) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  const auth = await requirePlatformAdmin();
  if ("response" in auth) return auth.response;
  const { sessionClient } = auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input: OnboardingInput = {
    name: text(body.name),
    slug: text(body.slug).toLowerCase(),
    productSlug: text(body.productSlug),
    planName: text(body.planName),
    planAmount: text(body.planAmount),
    subscriptionStatus: text(body.subscriptionStatus),
    termEnd: text(body.termEnd),
    email: text(body.email).toLowerCase(),
    phone: text(body.phone),
    address: text(body.address),
    city: text(body.city),
    state: text(body.state),
    pincode: text(body.pincode),
  };

  const fieldErrors = validateOnboarding(input);
  if (Object.keys(fieldErrors).length) return invalid("Some details need attention. Nothing was created.", fieldErrors);

  // The client type follows from the product sold, which must be a published product.
  const { data: product } = await sessionClient.from("products").select("slug").eq("slug", input.productSlug).eq("status", "published").maybeSingle();
  if (!product) return invalid("Choose a published product for this client.", { productSlug: "This product is no longer published. Choose another." });
  const organizationType = organizationTypeForProduct(product.slug);

  const admin = adminClientOrError();
  if ("response" in admin) return admin.response;
  const { adminClient } = admin;

  const { count: slugCount } = await adminClient.from("organizations").select("id", { count: "exact", head: true }).eq("slug", input.slug);
  if (slugCount) return invalid(SLUG_TAKEN, { slug: SLUG_TAKEN }, 409);

  const phone = toStoredPhone(input.phone, { kind: "landline" });
  const subscriptionStatus = input.subscriptionStatus === "trialing" ? "trialing" : "active";
  const contact = {
    address: input.address || null,
    city: input.city || null,
    state: input.state || null,
    pincode: input.pincode || null,
  };

  let organizationId: string | null = null;
  let invitedUserId: string | null = null;
  try {
    const { data: organization, error: organizationError } = await adminClient
      .from("organizations")
      .insert({
        name: input.name,
        slug: input.slug,
        type: organizationType,
        email: input.email,
        phone,
        ...contact,
        status: subscriptionStatus === "trialing" ? "trial" : "active",
      })
      .select("*")
      .single();
    if (organizationError) throw organizationError;
    organizationId = organization.id;

    if (organizationType === "school") {
      const { error: settingsError } = await adminClient.from("school_settings").insert({
        organization_id: organization.id,
        school_name: input.name,
        contact_email: input.email,
        contact_phone: phone,
        address: contact.address,
      });
      if (settingsError) throw settingsError;
    }

    const { error: subscriptionError } = await adminClient.from("subscriptions").insert({
      organization_id: organization.id,
      organization_name: input.name,
      plan_name: input.planName,
      amount: Number(input.planAmount),
      status: subscriptionStatus,
      next_billing_date: new Date(`${input.termEnd}T12:00:00.000Z`).toISOString(),
    });
    if (subscriptionError) throw subscriptionError;

    const redirectTo = new URL("/school/accept-invite", request.url).toString();
    const { data: invitation, error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(input.email, {
      data: { role: organizationType === "school" ? "school_admin" : "client_admin", organization_id: organization.id, organization_type: organizationType, organization_name: input.name },
      redirectTo,
    });
    if (invitationError) throw invitationError;
    invitedUserId = invitation.user.id;

    const { error: membershipError } = await adminClient.from("organization_members").insert({
      organization_id: organization.id,
      user_id: invitation.user.id,
      role: "admin",
    });
    if (membershipError) throw membershipError;

    // The client came from a website enquiry: close the lead and link it to the client.
    if (typeof body.leadId === "string" && /^[0-9a-f-]{36}$/i.test(body.leadId)) {
      const { error: leadError } = await adminClient
        .from("leads")
        .update({ status: "converted", organization_id: organization.id, next_follow_up: null, updated_at: new Date().toISOString() })
        .eq("id", body.leadId);
      if (leadError) console.error("Client created but the lead could not be marked converted:", leadError);
    }

    return NextResponse.json({ organization, invitationSent: true, subscriptionCreated: true }, { status: 201 });
  } catch (error) {
    if (invitedUserId) {
      const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(invitedUserId);
      if (deleteUserError) console.error("Failed to remove partially invited client admin:", deleteUserError);
    }
    if (organizationId) {
      const { error: deleteOrganizationError } = await adminClient
        .from("organizations")
        .delete()
        .eq("id", organizationId);
      if (deleteOrganizationError) console.error("Failed to clean up partially provisioned client:", deleteOrganizationError);
    }

    console.error("Client onboarding failed:", error);
    const emailLimit = friendlyAuthEmailError(error);
    if (emailLimit) return NextResponse.json({ error: `${emailLimit.message} Nothing was created.` }, { status: 429 });
    const details = typeof error === "object" && error !== null ? error as { code?: unknown; message?: unknown } : {};
    if (details.code === "email_exists" || /already been registered/i.test(String(details.message ?? ""))) {
      return invalid(`${EMAIL_TAKEN} Nothing was created.`, { email: EMAIL_TAKEN }, 409);
    }
    if (details.code === "23505") {
      return /slug/i.test(String(details.message ?? ""))
        ? invalid(`${SLUG_TAKEN} Nothing was created.`, { slug: SLUG_TAKEN }, 409)
        : NextResponse.json({ error: "This client or administrator already exists. Nothing was created." }, { status: 409 });
    }
    return NextResponse.json({ error: "The client workspace, subscription and administrator could not be fully set up, so nothing was created. Check that the database schemas are installed, then try again." }, { status: 500 });
  }
}

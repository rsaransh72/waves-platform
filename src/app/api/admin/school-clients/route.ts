import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

type SchoolClientInput = {
  name?: unknown;
  slug?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  pincode?: unknown;
  status?: unknown;
  type?: unknown;
  planName?: unknown;
  planAmount?: unknown;
  subscriptionStatus?: unknown;
  nextBillingDate?: unknown;
  leadId?: unknown;
};

export async function POST(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  if (request.headers.get("origin") !== requestOrigin) {
    return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  const sessionClient = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Sign in to a platform administrator account." }, { status: 401 });
  }

  const { data: isPlatformAdmin, error: roleError } = await sessionClient.rpc("is_platform_admin");
  if (roleError || !isPlatformAdmin) {
    return NextResponse.json({ error: "Only active platform administrators can onboard schools." }, { status: 403 });
  }

  let body: SchoolClientInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const supportedTypes = ["school", "hospital", "pharmacy", "other"];
  if (body.type !== undefined && (typeof body.type !== "string" || !supportedTypes.includes(body.type))) {
    return NextResponse.json({ error: "Choose a supported client product." }, { status: 400 });
  }
  const organizationType = typeof body.type === "string" ? body.type : "school";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || name.length > 200) {
    return NextResponse.json({ error: "School name is required and must be at most 200 characters." }, { status: 400 });
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Slug must use lowercase letters, numbers, and single hyphens." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "A valid school administrator email is required for the invitation." }, { status: 400 });
  }
  const planName = typeof body.planName === "string" ? body.planName.trim() : "";
  const planAmount = typeof body.planAmount === "number" ? body.planAmount : Number.NaN;
  const subscriptionStatus = body.subscriptionStatus === "trialing" ? "trialing" : body.subscriptionStatus === "active" ? "active" : "";
  const nextBillingDate = typeof body.nextBillingDate === "string" ? new Date(body.nextBillingDate) : null;
  if (!planName || planName.length > 100 || !Number.isFinite(planAmount) || planAmount < 0 || !subscriptionStatus || !nextBillingDate || Number.isNaN(nextBillingDate.getTime())) {
    return NextResponse.json({ error: "A valid plan, non-negative annual amount, subscription status, and term end date are required." }, { status: 400 });
  }

  let adminClient;
  try {
    adminClient = createSupabaseAdminClient();
  } catch (error) {
    console.error("School onboarding is not configured:", error);
    return NextResponse.json({ error: "School invitations are not configured. Set the server-only Supabase service-role key." }, { status: 503 });
  }

  let organizationId: string | null = null;
  let invitedUserId: string | null = null;
  try {
    const { data: organization, error: organizationError } = await adminClient
      .from("organizations")
      .insert({
        name,
        slug,
        type: organizationType,
        email,
        phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
        address: typeof body.address === "string" ? body.address.trim() || null : null,
        city: typeof body.city === "string" ? body.city.trim() || null : null,
        state: typeof body.state === "string" ? body.state.trim() || null : null,
        pincode: typeof body.pincode === "string" ? body.pincode.trim() || null : null,
        status: subscriptionStatus === "trialing" ? "trial" : "active",
      })
      .select("*")
      .single();
    if (organizationError) throw organizationError;
    organizationId = organization.id;

    if (organizationType === "school") {
      const { error: settingsError } = await adminClient.from("school_settings").insert({
        organization_id: organization.id,
        school_name: name,
        contact_email: email,
        contact_phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
        address: typeof body.address === "string" ? body.address.trim() || null : null,
      });
      if (settingsError) throw settingsError;
    }

    const { error: subscriptionError } = await adminClient.from("subscriptions").insert({
      organization_id: organization.id,
      organization_name: name,
      plan_name: planName,
      amount: planAmount,
      status: subscriptionStatus,
      next_billing_date: nextBillingDate.toISOString(),
    });
    if (subscriptionError) throw subscriptionError;

    const redirectTo = new URL("/school/accept-invite", request.url).toString();
    const { data: invitation, error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { role: organizationType === "school" ? "school_admin" : "client_admin", organization_id: organization.id, organization_type: organizationType, organization_name: name },
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
      if (deleteUserError) console.error("Failed to remove partially invited school admin:", deleteUserError);
    }
    if (organizationId) {
      const { error: deleteOrganizationError } = await adminClient
        .from("organizations")
        .delete()
        .eq("id", organizationId);
      if (deleteOrganizationError) console.error("Failed to clean up partially provisioned school:", deleteOrganizationError);
    }

    console.error("School client onboarding failed:", error);
    const status = typeof error === "object" && error !== null && "code" in error && error.code === "23505" ? 409 : 500;
    const message = status === 409
      ? "That school slug or administrator account is already in use."
      : "The client workspace, subscription, and administrator could not be fully provisioned. Check that the required database schemas are installed.";
    return NextResponse.json({ error: message }, { status });
  }
}
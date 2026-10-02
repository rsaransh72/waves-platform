import { createServerSupabaseClient } from "@/lib/supabase-server";
import { OnboardingForm } from "@/components/admin/OnboardingForm";
import { slugify } from "@/lib/client-onboarding";

export const revalidate = 0;

// Opened directly, or from a lead ("Onboard as client"), in which case the form is
// pre-filled from the enquiry and the lead is marked converted once the client exists.
export default async function ClientOnboardingPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead: leadId } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: productRows } = await supabase.from("products").select("slug, title, pricing").eq("status", "published").order("title");
  const products = (productRows ?? []).map((product) => ({
    slug: product.slug,
    title: product.title,
    pricing: (Array.isArray(product.pricing) ? product.pricing : [])
      .map((plan: { name?: string; plan?: string; price?: string | number | null; period?: string }) => ({ name: plan?.name ?? plan?.plan ?? "", price: plan?.price ?? null, period: plan?.period ?? "" }))
      .filter((plan: { name: string }) => plan.name),
  }));
  const { data: lead } = leadId
    ? await supabase.from("leads").select("id, name, email, phone, organization_name, city, product, status").eq("id", leadId).maybeSingle()
    : { data: null };

  const organizationName = lead?.organization_name || lead?.name || "";
  const initialData = lead
    ? {
        name: organizationName,
        slug: slugify(organizationName),
        type: (lead.product === "school-erp" ? "school" : "other") as "school" | "other",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        city: lead.city ?? "",
      }
    : {};

  return (
    <OnboardingForm
      initialData={initialData}
      products={products}
      lead={lead ? { name: lead.name, converted: lead.status === "converted" } : undefined}
      leadId={lead && lead.status !== "converted" ? lead.id : undefined}
    />
  );
}

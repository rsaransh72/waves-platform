import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { OnboardingForm } from "@/components/admin/OnboardingForm";

export const revalidate = 0;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

// Opened directly, or from a lead ("Onboard as client"), in which case the form is
// pre-filled from the enquiry and the lead is marked converted once the client exists.
export default async function ClientOnboardingPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead: leadId } = await searchParams;
  const supabase = await createServerSupabaseClient();
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
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Link
          href={lead ? "/admin/leads" : "/admin/organizations"}
          aria-label="Back"
          className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Building2 className="h-4 w-4" />
            Platform administration
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Onboard a client</h1>
          <p className="mt-1 text-sm text-slate-500">Create an organization, set its subscription, and invite its first administrator.</p>
        </div>
      </div>

      {lead && (
        <div className="border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {lead.status === "converted"
            ? "This lead has already been converted to a client."
            : <>Converting the lead from <strong>{lead.name}</strong>. Check the details below, especially the administrator email, which receives the invitation.</>}
        </div>
      )}

      <section className="border border-slate-200 bg-white p-5 sm:p-7">
        <OnboardingForm initialData={initialData} leadId={lead && lead.status !== "converted" ? lead.id : undefined} />
      </section>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { OrganizationEditor, type OnboardingProduct } from "@/components/admin/OrganizationEditor";

export function OnboardingForm({ initialData, leadId, products }: { products: OnboardingProduct[]; initialData: Partial<Record<"name" | "slug" | "email" | "phone" | "city", string>> & { type?: "school" | "other" }; leadId?: string }) {
  const router = useRouter();
  return (
    <OrganizationEditor
      initialData={initialData}
      isNew
      leadId={leadId}
      products={products}
      onClose={() => router.push(leadId ? "/admin/leads" : "/admin/organizations")}
    />
  );
}

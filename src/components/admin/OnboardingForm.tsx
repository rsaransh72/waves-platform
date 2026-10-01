"use client";

import { useRouter } from "next/navigation";
import { OrganizationEditor } from "@/components/admin/OrganizationEditor";

export function OnboardingForm({ initialData, leadId }: { initialData: Partial<Record<"name" | "slug" | "email" | "phone" | "city", string>> & { type?: "school" | "other" }; leadId?: string }) {
  const router = useRouter();
  return (
    <OrganizationEditor
      initialData={initialData}
      isNew
      leadId={leadId}
      onClose={() => router.push(leadId ? "/admin/leads" : "/admin/organizations")}
    />
  );
}

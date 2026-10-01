"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { OrganizationEditor } from "@/components/admin/OrganizationEditor";

export default function ClientOnboardingPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/organizations"
          aria-label="Back to organizations"
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

      <section className="border border-slate-200 bg-white p-5 sm:p-7">
        <OrganizationEditor
          initialData={{}}
          isNew
          onClose={() => router.push("/admin/organizations")}
        />
      </section>
    </div>
  );
}
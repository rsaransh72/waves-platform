import { AutomationBuilder } from "@/components/admin/AutomationBuilder";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AutomationBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  let ruleData = null;

  if (id !== "new") {
    const { data: rule, error } = await supabase
      .from("automation_rules")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !rule) {
      return notFound();
    }
    ruleData = rule;
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-slate-50 overflow-hidden rounded-lg border border-slate-200">
      <AutomationBuilder initialData={ruleData} />
    </div>
  );
}

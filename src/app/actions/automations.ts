"use server";

import { executeAutomations } from "@/lib/automations-engine";
import { requirePlatformAdmin } from "@/lib/supabase-server";

export async function triggerAutomationEvent(triggerEvent: string, payload: Record<string, unknown>) {
  const { supabase } = await requirePlatformAdmin();
  await executeAutomations(supabase, triggerEvent, payload);
}

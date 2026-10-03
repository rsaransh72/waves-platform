"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";

// The public website is cached for a minute at a time. The admin editors write content
// from the browser, so they call this after a save to show the change straight away.
export async function refreshPublicSite() {
  await requirePlatformAdmin();
  revalidatePath("/", "layout");
}

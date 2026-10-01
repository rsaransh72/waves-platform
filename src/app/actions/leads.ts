"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/supabase-server";
import { LEAD_STATUSES } from "@/lib/lead-pipeline";

export type LeadActionResult = { error?: string; message?: string };

const INQUIRY_TYPES = ["demo", "contact", "consultation", "pricing", "access"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function run(work: (admin: Awaited<ReturnType<typeof requirePlatformAdmin>>) => Promise<string>): Promise<LeadActionResult> {
  try {
    const admin = await requirePlatformAdmin();
    const message = await work(admin);
    revalidatePath("/admin/leads");
    return { message };
  } catch (error) {
    console.error("Lead action failed:", error);
    const message = typeof error === "object" && error !== null && "message" in error ? String((error as { message: unknown }).message) : "The action could not be completed.";
    return { error: message };
  }
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// For enquiries that arrive by phone, email or in person.
export async function createLead(input: Record<string, string>) {
  return run(async ({ supabase }) => {
    const name = text(input.name, 120);
    const email = text(input.email, 200).toLowerCase();
    const phone = text(input.phone, 30);
    if (name.length < 2) throw new Error("Enter the contact's name.");
    if (!phone && !email) throw new Error("Enter a phone number or an email address.");
    if (email && !EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email address.");
    const inquiryType = (INQUIRY_TYPES as readonly string[]).includes(input.inquiry_type) ? input.inquiry_type : "demo";
    const { error } = await supabase.from("leads").insert([{
      name,
      email,
      phone,
      organization_name: text(input.organization_name, 200) || null,
      city: text(input.city, 100) || null,
      product: text(input.product, 100) || "general",
      message: text(input.message, 2000) || null,
      inquiry_type: inquiryType,
      source: text(input.source, 100) || "manual",
      status: "new",
    }]);
    if (error) throw error;
    return "Lead added.";
  });
}

export async function updateLeadPipeline(leadId: string, input: { status: string; next_follow_up: string; lost_reason: string }) {
  return run(async ({ supabase }) => {
    if (!(LEAD_STATUSES as readonly string[]).includes(input.status)) throw new Error("Choose a status.");
    if (input.status === "converted") throw new Error("Use \"Onboard as client\" to convert a lead, so the client account is created and linked.");
    if (input.status === "lost" && !text(input.lost_reason, 300)) throw new Error("Say why the lead was lost; it helps later.");
    if (input.next_follow_up && !/^\d{4}-\d{2}-\d{2}$/.test(input.next_follow_up)) throw new Error("Enter a valid follow-up date.");
    const closed = input.status === "lost";
    const { error } = await supabase.from("leads").update({
      status: input.status,
      next_follow_up: closed ? null : input.next_follow_up || null,
      lost_reason: closed ? text(input.lost_reason, 300) : null,
      updated_at: new Date().toISOString(),
    }).eq("id", leadId).neq("status", "converted");
    if (error) throw error;
    return "Lead updated.";
  });
}

export async function addLeadNote(leadId: string, body: string) {
  return run(async ({ supabase, user }) => {
    const note = text(body, 4000);
    if (!note) throw new Error("Write a note first.");
    const { error } = await supabase.from("lead_notes").insert({ lead_id: leadId, body: note, author_email: user.email ?? null });
    if (error) throw error;
    return "Note added.";
  });
}

export async function deleteLead(leadId: string) {
  return run(async ({ supabase }) => {
    const { error } = await supabase.from("leads").delete().eq("id", leadId).neq("status", "converted");
    if (error) throw error;
    return "Lead deleted.";
  });
}

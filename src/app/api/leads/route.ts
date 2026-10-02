import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getPublishedProducts, getSiteSettings } from "@/lib/site-content";
import { cityError, emailError, formatPhone, personNameError, phoneError, toStoredPhone } from "@/lib/india";

// Every enquiry form on the website posts here. The lead lands in Admin → Leads,
// where the sales team works it from "new" through to "converted" (onboarded) or "lost".

const INQUIRY_TYPES = ["demo", "contact", "consultation", "pricing", "access"] as const;
type InquiryType = typeof INQUIRY_TYPES[number];

const INQUIRY_LABELS: Record<InquiryType, string> = {
  demo: "Demo request",
  contact: "General enquiry",
  consultation: "Services consultation",
  pricing: "Pricing quote",
  access: "Account access request",
};

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !to) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!response.ok) console.error("[Leads API] Email delivery failed:", response.status, await response.text());
  return response.ok;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field, including this one, which people never see.
  if (text(body.website, 200)) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const inquiryType = (INQUIRY_TYPES as readonly string[]).includes(body.inquiryType as string) ? body.inquiryType as InquiryType : "demo";
  const name = text(body.name, 120);
  const email = text(body.email, 200).toLowerCase();
  const phone = text(body.phone, 30);
  const organizationName = text(body.organizationName, 200);
  const city = text(body.city, 100);
  const teamSize = text(body.teamSize, 50);
  const message = text(body.message, 2000);
  const requestedProduct = text(body.product, 100);

  const invalid = personNameError(name) ?? emailError(email, true) ?? phoneError(phone, { required: true }) ?? cityError(city)
    ?? (inquiryType !== "contact" && organizationName.length < 2 ? "Please enter your organization name." : null)
    ?? (inquiryType === "contact" && message.length < 10 ? "Please tell us how we can help (at least 10 characters)." : null);
  if (invalid) return NextResponse.json({ success: false, error: invalid }, { status: 400 });
  const storedPhone = toStoredPhone(phone, { required: true });

  const products = await getPublishedProducts();
  const product = products.find((item) => item.slug === requestedProduct);

  const { error } = await supabase.from("leads").insert([{
    name,
    email,
    phone: storedPhone,
    organization_name: organizationName || null,
    product: product?.slug ?? "general",
    city: city || null,
    team_size: teamSize || null,
    message: message || null,
    inquiry_type: inquiryType,
    source: text(body.source, 100) || "website",
    status: "new",
  }]);

  if (error) {
    console.error("[Leads API] Lead could not be saved:", error.code, error.message);
    return NextResponse.json(
      { success: false, error: "We could not submit your request right now. Please try again in a moment." },
      { status: 500 }
    );
  }

  const settings = await getSiteSettings();
  const salesInbox = settings.lead_notification_email || settings.sales_email;
  const productName = product?.title ?? "General";
  const rows: Array<[string, string]> = [
    ["Type", INQUIRY_LABELS[inquiryType]],
    ["Product", productName],
    ["Name", name],
    ["Email", email],
    ["Phone", formatPhone(storedPhone)],
    ["Organization", organizationName],
    ["City", city],
    ["Size", teamSize],
    ["Message", message],
  ];
  const [, confirmation] = await Promise.allSettled([
    sendEmail(
      salesInbox,
      `New ${INQUIRY_LABELS[inquiryType].toLowerCase()}: ${organizationName || name}`,
      `<p>A new enquiry arrived from the website. Open Admin → Leads to follow it up.</p><table>${rows
        .filter(([, value]) => value)
        .map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`)
        .join("")}</table>`,
      email
    ),
    sendEmail(
      email,
      `We received your request – ${settings.company_name}`,
      `<p>Hello ${escapeHtml(name)},</p><p>Thank you for contacting ${escapeHtml(settings.company_name)}. We have received your ${escapeHtml(INQUIRY_LABELS[inquiryType].toLowerCase())}${product ? ` for ${escapeHtml(product.title)}` : ""} and a member of our team will contact you at ${escapeHtml(formatPhone(storedPhone))}.</p>${settings.phone ? `<p>If you need us sooner, call ${escapeHtml(formatPhone(settings.phone))}.</p>` : ""}`,
      salesInbox || undefined
    ),
  ]);

  const confirmationSent = confirmation.status === "fulfilled" && confirmation.value === true;
  return NextResponse.json({ success: true, confirmationSent }, { status: 201 });
}

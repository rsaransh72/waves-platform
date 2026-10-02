// Stages a website enquiry moves through, from arrival to an onboarded client.
export const LEAD_STATUSES = ["new", "contacted", "demo_scheduled", "qualified", "converted", "lost"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];

export const OPEN_LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "demo_scheduled", "qualified"];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  demo_scheduled: "Demo scheduled",
  qualified: "Qualified",
  converted: "Converted",
  lost: "Lost",
};

export const LEAD_STATUS_HINTS: Record<LeadStatus, string> = {
  new: "Not contacted yet. Call or email within one working day.",
  contacted: "Spoken to; agree a demo time.",
  demo_scheduled: "Demo booked. Set the follow-up date to the demo date.",
  qualified: "Interested and a good fit; send the quote and agree terms.",
  converted: "Onboarded as a client.",
  lost: "Not going ahead.",
};

export const INQUIRY_LABELS: Record<string, string> = {
  demo: "Demo request",
  contact: "General enquiry",
  consultation: "Services consultation",
  pricing: "Pricing quote",
  access: "Account request",
};

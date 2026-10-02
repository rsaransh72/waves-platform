import { redirect } from "next/navigation";

export default async function InvoiceCompatibilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/billing?invoice=${encodeURIComponent(id)}`);
}
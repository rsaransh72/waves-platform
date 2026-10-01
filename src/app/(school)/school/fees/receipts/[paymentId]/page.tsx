import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { amountInWords, formatMoney } from "@/lib/money";
import { PrintButton } from "@/components/school/PrintButton";

export const metadata = {
  title: "Fee Receipt | School ERP",
};

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank transfer",
  cheque: "Cheque",
  card: "Card",
  other: "Other",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function FeeReceiptPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: payment }, { data: school }] = await Promise.all([
    supabase
      .from("school_fee_payments")
      .select(`
        id, receipt_number, amount_paid, payment_date, payment_method, transaction_id,
        school_student_fees (
          id, amount_due, amount_paid, due_date,
          school_students (first_name, last_name, roll_number, parent_phone, school_classes (name, section)),
          school_fee_structures (name, frequency)
        )
      `)
      .eq("id", paymentId)
      .maybeSingle(),
    supabase.from("school_settings").select("school_name, logo_url, address, contact_email, contact_phone").maybeSingle(),
  ]);

  if (!payment) notFound();

  // Supabase types nested to-one relations as arrays; the queries above return single rows.
  const fee = (Array.isArray(payment.school_student_fees) ? payment.school_student_fees[0] : payment.school_student_fees) as unknown as {
    amount_due: number;
    amount_paid: number;
    due_date: string;
    school_students: { first_name: string; last_name: string; roll_number: string; parent_phone: string | null; school_classes: { name: string; section: string } | null } | null;
    school_fee_structures: { name: string; frequency: string | null } | null;
  } | null;
  const student = fee?.school_students;
  const balance = Number(fee?.amount_due ?? 0) - Number(fee?.amount_paid ?? 0);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/school/fees/collection" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ChevronLeft className="h-4 w-4" /> Fee collection
        </Link>
        <PrintButton />
      </div>

      <article className="rounded-lg border border-slate-300 bg-white p-8 text-slate-900 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6 border-b-2 border-slate-900 pb-5">
          <div className="flex items-start gap-4">
            {school?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={school.logo_url} alt="" className="h-16 w-16 object-contain" />
            )}
            <div>
              <h1 className="text-xl font-bold">{school?.school_name ?? "School"}</h1>
              {school?.address && <p className="mt-1 max-w-sm text-sm text-slate-600">{school.address}</p>}
              <p className="mt-1 text-sm text-slate-600">{[school?.contact_phone, school?.contact_email].filter(Boolean).join(" · ")}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Fee receipt</p>
            <p className="mt-1 font-mono text-lg font-bold">{payment.receipt_number ?? "—"}</p>
            <p className="mt-1 text-sm text-slate-600">{formatDate(payment.payment_date)}</p>
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 py-6 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Received from</dt>
            <dd className="mt-0.5 font-semibold">{student ? `${student.first_name} ${student.last_name}` : "Student"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Roll number</dt>
            <dd className="mt-0.5 font-semibold">{student?.roll_number ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Class</dt>
            <dd className="mt-0.5 font-semibold">{student?.school_classes ? `${student.school_classes.name} - ${student.school_classes.section}` : "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Payment method</dt>
            <dd className="mt-0.5 font-semibold">
              {METHOD_LABELS[payment.payment_method ?? ""] ?? payment.payment_method ?? "—"}
              {payment.transaction_id && <span className="font-normal text-slate-600"> · Ref {payment.transaction_id}</span>}
            </dd>
          </div>
        </dl>

        <table className="w-full border-y border-slate-300 text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase text-slate-500">
              <th className="py-2">Particulars</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="py-3">
                {fee?.school_fee_structures?.name ?? "School fee"}
                {fee?.due_date && <span className="block text-xs text-slate-500">Due {formatDate(fee.due_date)}</span>}
              </td>
              <td className="py-3 text-right font-semibold">{formatMoney(payment.amount_paid)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900">
              <td className="py-3 font-bold">Amount received</td>
              <td className="py-3 text-right text-lg font-bold">{formatMoney(payment.amount_paid)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-3 text-sm"><span className="font-semibold">In words:</span> {amountInWords(payment.amount_paid)}</p>
        <p className="mt-1 text-sm text-slate-600">
          Invoice total {formatMoney(fee?.amount_due)} · Paid to date {formatMoney(fee?.amount_paid)} · Balance {formatMoney(balance)}
        </p>

        <footer className="mt-16 flex items-end justify-between text-xs text-slate-500">
          <p>This is a computer-generated receipt.</p>
          <div className="w-48 border-t border-slate-400 pt-1 text-center">Authorised signatory</div>
        </footer>
      </article>
    </div>
  );
}

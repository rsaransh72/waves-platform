"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/admin/Drawer";
import { createClient } from "@/lib/supabase-browser";
import { describeError } from "@/lib/error-message";
import { formatMoney } from "@/lib/money";
import { formatDate, formatIndianNumber } from "@/lib/india";

type Student = { id: string; class_id: string | null };
type SchoolClass = { id: string; name: string; section: string };
type FeeStructure = { id: string; name: string; amount: number };
type ExistingFee = { student_id: string; fee_structure_id: string; due_date: string };

const fieldClass = "w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none";
const labelClass = "block text-[13px] font-medium text-[#333333] mb-1.5";

// Raises one fee head for a whole class, several classes or the whole school in a
// single insert. A student who already owes this fee for the same due date is
// skipped, here in the preview and again by the database's unique index.
export function AssignFeeDrawer({ isOpen, onClose, onAssigned, students, classes, structures, existingFees }: {
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
  students: Student[];
  classes: SchoolClass[];
  structures: FeeStructure[];
  existingFees: ExistingFee[];
}) {
  const [structureId, setStructureId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [scope, setScope] = useState<"school" | "classes">("classes");
  const [classIds, setClassIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const structure = structures.find((item) => item.id === structureId) ?? null;
  const studentsPerClass = useMemo(() => {
    const counts = new Map<string, number>();
    for (const student of students) if (student.class_id) counts.set(student.class_id, (counts.get(student.class_id) ?? 0) + 1);
    return counts;
  }, [students]);

  const plan = useMemo(() => {
    const inScope = scope === "school" ? students : students.filter((student) => student.class_id && classIds.includes(student.class_id));
    const sameFee = existingFees.filter((fee) => fee.fee_structure_id === structureId);
    const owesOnThisDate = new Set(sameFee.filter((fee) => fee.due_date === dueDate).map((fee) => fee.student_id));
    const owesOnOtherDate = new Set(sameFee.filter((fee) => fee.due_date !== dueDate).map((fee) => fee.student_id));
    const toBill = inScope.filter((student) => !owesOnThisDate.has(student.id));
    return {
      toBill,
      skipped: inScope.length - toBill.length,
      alsoOwedOnAnotherDate: toBill.filter((student) => owesOnOtherDate.has(student.id)).length,
    };
  }, [scope, students, classIds, existingFees, structureId, dueDate]);

  const total = structure ? plan.toBill.length * Number(structure.amount) : 0;
  const ready = Boolean(structure && dueDate && plan.toBill.length > 0);

  const reset = () => {
    setStructureId("");
    setDueDate("");
    setScope("classes");
    setClassIds([]);
  };

  const assign = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!structure || !ready || isSaving) return;
    setIsSaving(true);
    const rows = plan.toBill.map((student) => ({
      student_id: student.id,
      fee_structure_id: structure.id,
      due_date: dueDate,
      amount_due: structure.amount,
      amount_paid: 0,
      status: "pending",
    }));
    const { error, count } = await createClient()
      .from("school_student_fees")
      .upsert(rows, { onConflict: "student_id,fee_structure_id,due_date", ignoreDuplicates: true, count: "exact" });
    setIsSaving(false);
    if (error) {
      toast.error(`Could not assign the fee: ${describeError(error)}`);
      return;
    }
    const created = count ?? rows.length;
    const raced = rows.length - created;
    toast.success(`${structure.name} assigned to ${formatIndianNumber(created)} ${created === 1 ? "student" : "students"}.${raced > 0 ? ` ${raced} already had it and were skipped.` : ""}`);
    reset();
    onAssigned();
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Assign a fee to classes">
      <form onSubmit={assign} className="p-6 space-y-5">
        <div>
          <label htmlFor="assign-fee" className={labelClass}>Fee *</label>
          <select id="assign-fee" required value={structureId} onChange={(event) => setStructureId(event.target.value)} className={fieldClass}>
            <option value="">Choose a fee…</option>
            {structures.map((item) => <option key={item.id} value={item.id}>{item.name} · {formatMoney(item.amount)}</option>)}
          </select>
          {structures.length === 0 && <p className="mt-1.5 text-[12px] text-[#555]">Create a fee in Fee Structures first.</p>}
        </div>

        <div>
          <label htmlFor="assign-due" className={labelClass}>Due date *</label>
          <input id="assign-due" type="date" required value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClass} />
        </div>

        <fieldset>
          <legend className={labelClass}>Who pays *</legend>
          <div className="flex flex-wrap gap-4 text-[14px] text-[#111]">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="assign-scope" checked={scope === "classes"} onChange={() => setScope("classes")} /> Chosen classes
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="assign-scope" checked={scope === "school"} onChange={() => setScope("school")} /> Whole school ({formatIndianNumber(students.length)} students)
            </label>
          </div>
          {scope === "classes" && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {classes.map((schoolClass) => (
                <label key={schoolClass.id} className="flex items-center gap-2 rounded-md border border-[#e5e5e5] px-3 py-2 text-[14px] text-[#111]">
                  <input
                    type="checkbox"
                    checked={classIds.includes(schoolClass.id)}
                    onChange={(event) => setClassIds((current) => event.target.checked ? [...current, schoolClass.id] : current.filter((id) => id !== schoolClass.id))}
                  />
                  <span className="flex-1">{schoolClass.name} - {schoolClass.section}</span>
                  <span className="text-[12px] text-[#888] tabular-nums">{studentsPerClass.get(schoolClass.id) ?? 0}</span>
                </label>
              ))}
              {classes.length === 0 && <p className="text-[13px] text-[#555]">No classes yet.</p>}
            </div>
          )}
        </fieldset>

        <div role="status" className="rounded-md border border-[#e5e5e5] bg-[#fafafa] p-4 text-[14px] text-[#333] space-y-1.5">
          {!structure || !dueDate ? (
            <p>Choose a fee and a due date to see who will be billed.</p>
          ) : (
            <>
              <p className="font-semibold text-[#111]">
                {formatIndianNumber(plan.toBill.length)} {plan.toBill.length === 1 ? "student" : "students"} × {formatMoney(structure.amount)} = {formatMoney(total)}
              </p>
              {plan.skipped > 0 && <p>{formatIndianNumber(plan.skipped)} already owe this fee for {formatDate(dueDate)} and will be skipped.</p>}
              {plan.alsoOwedOnAnotherDate > 0 && (
                <p className="text-[#b45309]">{formatIndianNumber(plan.alsoOwedOnAnotherDate)} already owe this fee for another date. Assign it only if this is a new instalment.</p>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 h-10 border border-[#cccccc] rounded-md font-medium text-[14px] text-[#333]">Cancel</button>
          <button type="submit" disabled={!ready || isSaving} className="flex-1 h-10 bg-[#0066cc] text-white rounded-md font-medium text-[14px] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? "Assigning…" : `Assign to ${formatIndianNumber(plan.toBill.length)} ${plan.toBill.length === 1 ? "student" : "students"}`}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

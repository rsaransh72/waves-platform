/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Drawer } from "@/components/admin/Drawer";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { describeError } from "@/lib/error-message";
import { EmailInput, NameInput, PhoneInput } from "@/components/forms/IndiaInputs";
import { formatPhone } from "@/lib/india";

const SUGGESTED_SUBJECTS = ["Mathematics", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies", "Computer Science", "Physical Education", "Art", "Music"];
const inputClass = "w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

export function TeachersList({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const canManage = useCanManage("teachers");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const teacherData = initialData.map((teacher) => ({
    ...teacher,
    name: `${teacher.first_name} ${teacher.last_name}`,
    subject: teacher.primary_subject || "Not set",
  }));
  const subjects = Array.from(new Set(teacherData.map((teacher) => teacher.subject))).sort();

  const handleDeactivate = async (teacher: any) => {
    if (!window.confirm(`Mark ${teacher.first_name} ${teacher.last_name} as inactive? Their records will be retained.`)) return;
    const { error } = await createClient().from("school_teachers").update({ status: "inactive" }).eq("id", teacher.id);
    if (error) {
      toast.error(`Could not update teacher: ${describeError(error)}`);
      return;
    }
    toast.success("Teacher marked inactive.");
    router.refresh();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Teacher Name",
      cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.name}</span>,
    },
    { accessorKey: "employee_id", header: "Employee ID" },
    { accessorKey: "subject", header: "Primary Subject" },
    { accessorKey: "email", header: "Email", cell: ({ row }) => <span>{row.original.email || "—"}</span> },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => <span className="whitespace-nowrap">{row.original.phone ? formatPhone(row.original.phone) : "—"}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "active";
        const color = status === "active" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-slate-700 bg-slate-50 border-slate-200";
        return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${color}`}>{status}</span>;
      },
    },
    ...(!canManage ? [] : [{
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => { setSelectedTeacher(row.original); setIsDrawerOpen(true); }}
            aria-label={`Edit ${row.original.name}`}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {row.original.status !== "inactive" && (
            <button
              onClick={() => handleDeactivate(row.original)}
              aria-label={`Mark ${row.original.name} inactive`}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    } as ColumnDef<any>]),
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teachers & Staff</h1>
          <p className="text-sm font-medium text-slate-500">Staff profiles used for class teachers and the timetable. To give someone a login, use Users & Access.</p>
        </div>
        {canManage && (
          <button
            onClick={() => { setSelectedTeacher(null); setIsDrawerOpen(true); }}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Teacher
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 w-full">
        <DataTable
          columns={columns}
          data={teacherData}
          searchKey="name"
          disablePagination={false}
          filters={[{ key: "subject", label: "All Subjects", options: subjects.map((subject) => ({ label: subject, value: subject })) }]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedTeacher ? "Edit Teacher Profile" : "Add New Teacher"}
      >
        <div className="p-6">
          <form key={selectedTeacher?.id || "new-teacher"} className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (isSaving) return;
            const form = e.target as HTMLFormElement;
            const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement).value.trim();
            const teacherRecord = {
              first_name: value("firstName"),
              last_name: value("lastName"),
              employee_id: value("employeeId").toUpperCase(),
              primary_subject: value("subject") || null,
              email: value("email").toLowerCase() || null,
              phone: value("phone") || null,
              status: selectedTeacher ? value("status") : "active",
            };

            setIsSaving(true);
            try {
              const supabase = createClient();
              const { error } = selectedTeacher
                ? await supabase.from("school_teachers").update(teacherRecord).eq("id", selectedTeacher.id)
                : await supabase.from("school_teachers").insert(teacherRecord);
              if (error) throw error;
              toast.success(selectedTeacher ? "Teacher updated." : "Teacher added.");
              setIsDrawerOpen(false);
              setSelectedTeacher(null);
              router.refresh();
            } catch (error) {
              toast.error(`Could not save teacher: ${describeError(error, "That employee ID is already in use.")}`);
            } finally {
              setIsSaving(false);
            }
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <NameInput name="firstName" defaultValue={selectedTeacher?.first_name || ""} className={inputClass} placeholder="e.g. Priya" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name / Surname</label>
                <NameInput name="lastName" defaultValue={selectedTeacher?.last_name || ""} className={inputClass} placeholder="e.g. Verma" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Employee ID</label>
              <input name="employeeId" type="text" defaultValue={selectedTeacher?.employee_id || ""} className={inputClass} placeholder="e.g. T-001" required maxLength={20} pattern="[A-Za-z0-9/-]+" title="Letters, digits, / and - only" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Primary Subject</label>
              <input name="subject" list="teacher-subjects" defaultValue={selectedTeacher?.primary_subject || ""} className={inputClass} placeholder="e.g. Mathematics" />
              <datalist id="teacher-subjects">
                {SUGGESTED_SUBJECTS.map((subject) => <option key={subject} value={subject} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <EmailInput name="email" defaultValue={selectedTeacher?.email || ""} className={inputClass} placeholder="teacher@school.in" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mobile</label>
                <PhoneInput name="phone" defaultValue={selectedTeacher?.phone || ""} className={inputClass} />
              </div>
            </div>

            {selectedTeacher && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select name="status" defaultValue={selectedTeacher.status || "active"} className={inputClass}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
                {selectedTeacher ? "Save Changes" : "Add Teacher"}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}

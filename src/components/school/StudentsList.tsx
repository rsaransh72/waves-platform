/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Trash2, FileSpreadsheet } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Drawer } from "@/components/admin/Drawer";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { describeError } from "@/lib/error-message";
import { NameInput, PhoneInput } from "@/components/forms/IndiaInputs";
import { formatPhone } from "@/lib/india";
import { schoolToday } from "@/lib/school-date";
import { BLOOD_GROUPS, CATEGORIES, GENDERS, dateOfBirthError } from "@/lib/school-students";

const fieldClass = "w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";
const labelClass = "text-sm font-medium text-slate-700";
const sectionClass = "mb-3 text-xs font-bold uppercase tracking-wider text-slate-500";

export function StudentsList({ initialData, classes }: { initialData: any[], classes: any[] }) {
  const router = useRouter();
  const canManage = useCanManage("students");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const studentData = initialData.map((student) => ({
    ...student,
    name: `${student.first_name} ${student.last_name}`,
    class: student.school_classes
      ? `${student.school_classes.name} - ${student.school_classes.section}`
      : "Unassigned",
  }));

  const handleDeactivate = async (student: any) => {
    if (!window.confirm(`Deactivate ${student.first_name} ${student.last_name}? Their records will be retained.`)) return;

    const { error } = await createClient()
      .from("school_students")
      .update({ status: "inactive" })
      .eq("id", student.id);

    if (error) {
      toast.error(`Could not deactivate student: ${describeError(error)}`);
      return;
    }

    toast.success("Student deactivated; their records were retained.");
    router.refresh();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Student Name",
      cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.first_name} {row.original.last_name}</span>,
    },
    {
      accessorKey: "admission_number",
      header: "Adm. No.",
      cell: ({ row }) => <span className="tabular-nums">{row.original.admission_number || "—"}</span>,
    },
    {
      accessorKey: "roll_number",
      header: "Roll Number",
    },
    {
      accessorKey: "class",
      header: "Class",
      cell: ({ row }) => <span>{row.original.school_classes?.name || 'N/A'}</span>,
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ row }) => <span>{row.original.school_classes?.section || 'N/A'}</span>,
    },
    {
      accessorKey: "parent_phone",
      header: "Parent Phone",
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.parent_phone ? formatPhone(row.original.parent_phone) : "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status || 'active';
        const color = s === "active" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-slate-700 bg-slate-50 border-slate-200";
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${color}`}>
            {s}
          </span>
        );
      },
    },
    ...(!canManage ? [] : [{
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setSelectedStudent(row.original); setIsDrawerOpen(true); }}
            aria-label={`Edit ${row.original.name}`}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeactivate(row.original)}
            aria-label={`Deactivate ${row.original.name}`}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    } as ColumnDef<any>]),
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-sm font-medium text-slate-500">Manage student enrollments and records</p>
        </div>
        {canManage && <div className="flex flex-wrap gap-2">
          <Link href="/school/students/import" className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition-all hover:bg-slate-50 shadow-sm">
            <FileSpreadsheet className="h-4 w-4" /> Import from Excel
          </Link>
          <button
            onClick={() => { setSelectedStudent(null); setIsDrawerOpen(true); }}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Admit Student
          </button>
        </div>}
      </div>

      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={studentData} 
          searchKey="name" 
          disablePagination={false} 
          filters={[
            {
              key: "class",
              label: "All Classes",
              options: classes.map((schoolClass) => ({
                label: `${schoolClass.name} - ${schoolClass.section}`,
                value: `${schoolClass.name} - ${schoolClass.section}`,
              })),
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedStudent ? "Edit Student" : "Admit New Student"}
      >
        <div className="p-6">
          <form key={selectedStudent?.id || "new-student"} className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            if (isSaving) return;
            const form = e.target as HTMLFormElement;
            const value = (name: string) => ((form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "").trim();
            const dateOfBirth = value("dateOfBirth");
            const dobProblem = dateOfBirthError(dateOfBirth);
            if (dobProblem) {
              toast.error(dobProblem);
              return;
            }

            const studentRecord = {
              first_name: value("firstName"),
              last_name: value("lastName"),
              admission_number: value("admissionNumber").toUpperCase() || null,
              admission_date: value("admissionDate") || null,
              roll_number: value("rollNumber").toUpperCase(),
              class_id: value("class_id"),
              date_of_birth: dateOfBirth || null,
              gender: value("gender") || null,
              father_name: value("fatherName") || null,
              mother_name: value("motherName") || null,
              parent_phone: value("phone") || null,
              address: value("address") || null,
              category: value("category") || null,
              blood_group: value("bloodGroup") || null,
              // The status field only exists when editing; new admissions start active.
              status: selectedStudent ? value("status") : "active",
            };

            setIsSaving(true);
            try {
              const supabase = createClient();
              const { error } = selectedStudent
                ? await supabase.from("school_students").update(studentRecord).eq("id", selectedStudent.id)
                : await supabase.from("school_students").insert(studentRecord);
              if (error) throw error;

              toast.success(selectedStudent ? "Student updated." : "Student enrolled.");
              setIsDrawerOpen(false);
              setSelectedStudent(null);
              router.refresh();
            } catch (error) {
              const duplicate = String((error as { message?: string })?.message ?? "").includes("admission_number")
                ? "That admission number is already used by another student."
                : "That roll number is already used in this class.";
              toast.error(`Could not save student: ${describeError(error, duplicate)}`);
            } finally {
              setIsSaving(false);
            }
          }}>
            <fieldset className="space-y-4">
              <legend className={sectionClass}>Student</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="student-first" className={labelClass}>First name *</label>
                  <NameInput id="student-first" name="firstName" defaultValue={selectedStudent?.first_name || ""} className={fieldClass} placeholder="e.g. Aarav" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-last" className={labelClass}>Last name / surname</label>
                  <NameInput id="student-last" name="lastName" defaultValue={selectedStudent?.last_name || ""} className={fieldClass} placeholder="e.g. Sharma" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-dob" className={labelClass}>Date of birth</label>
                  <input id="student-dob" name="dateOfBirth" type="date" min="1990-01-01" max={schoolToday()} defaultValue={selectedStudent?.date_of_birth || ""} className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-gender" className={labelClass}>Gender</label>
                  <select id="student-gender" name="gender" defaultValue={selectedStudent?.gender || ""} className={fieldClass}>
                    <option value="">Not recorded</option>
                    {GENDERS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className={sectionClass}>Admission and class</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="student-admission" className={labelClass}>Admission number</label>
                  <input id="student-admission" name="admissionNumber" type="text" defaultValue={selectedStudent?.admission_number || ""} className={fieldClass} placeholder="e.g. 2026/0412" maxLength={20} pattern="[A-Za-z0-9\/\-]+" title="Letters, digits, / and - only" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-admitted" className={labelClass}>Admission date</label>
                  <input id="student-admitted" name="admissionDate" type="date" max={schoolToday()} defaultValue={selectedStudent?.admission_date || (selectedStudent ? "" : schoolToday())} className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-class" className={labelClass}>Class and section *</label>
                  <select id="student-class" name="class_id" defaultValue={selectedStudent?.class_id || ""} required className={fieldClass}>
                    <option value="">Choose a class</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-roll" className={labelClass}>Roll number *</label>
                  <input id="student-roll" name="rollNumber" type="text" defaultValue={selectedStudent?.roll_number || ""} className={fieldClass} placeholder="e.g. 12" required maxLength={20} pattern="[A-Za-z0-9\/\-]+" title="Letters, digits, / and - only" aria-describedby="student-roll-hint" />
                  <p id="student-roll-hint" className="text-xs text-slate-500">Unique within the class.</p>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className={sectionClass}>Parents</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="student-father" className={labelClass}>Father&apos;s name</label>
                  <NameInput id="student-father" name="fatherName" defaultValue={selectedStudent?.father_name || ""} className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-mother" className={labelClass}>Mother&apos;s name</label>
                  <NameInput id="student-mother" name="motherName" defaultValue={selectedStudent?.mother_name || ""} className={fieldClass} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="student-phone" className={labelClass}>Parent or guardian mobile</label>
                  <PhoneInput id="student-phone" name="phone" defaultValue={selectedStudent?.parent_phone || ""} className={fieldClass} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="student-address" className={labelClass}>Address</label>
                  <textarea id="student-address" name="address" rows={2} maxLength={250} defaultValue={selectedStudent?.address || ""} className={fieldClass} placeholder="House, street, area, city, PIN code" />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className={sectionClass}>Other details</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="student-category" className={labelClass}>Category</label>
                  <select id="student-category" name="category" defaultValue={selectedStudent?.category || ""} className={fieldClass}>
                    <option value="">Not recorded</option>
                    {CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-blood" className={labelClass}>Blood group</label>
                  <select id="student-blood" name="bloodGroup" defaultValue={selectedStudent?.blood_group || ""} className={fieldClass}>
                    <option value="">Not recorded</option>
                    {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
                  </select>
                </div>
                {selectedStudent && (
                  <div className="space-y-2">
                    <label htmlFor="student-status" className={labelClass}>Enrollment status</label>
                    <select id="student-status" name="status" defaultValue={selectedStudent.status || "active"} className={fieldClass}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
            </fieldset>

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
                {selectedStudent ? "Save Changes" : "Admit Student"}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}

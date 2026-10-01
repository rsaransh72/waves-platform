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

export function StudentsList({ initialData, classes }: { initialData: any[], classes: any[] }) {
  const router = useRouter();
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
      toast.error(`Could not deactivate student: ${error.message}`);
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
      cell: ({ row }) => <span>{row.original.parent_phone || 'N/A'}</span>,
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
    {
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
    },
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-sm font-medium text-slate-500">Manage student enrollments and records</p>
        </div>
        <button
          onClick={() => { setSelectedStudent(null); setIsDrawerOpen(true); }}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Admit Student
        </button>
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
          <form key={selectedStudent?.id || "new-student"} className="space-y-4" onSubmit={async (e) => { 
            e.preventDefault(); 
            if (isSaving) return;
            const form = e.target as HTMLFormElement;
            const supabase = createClient();
            
            const studentRecord = {
              first_name: (form.elements.namedItem('firstName') as HTMLInputElement).value,
              last_name: (form.elements.namedItem('lastName') as HTMLInputElement).value,
              roll_number: (form.elements.namedItem('rollNumber') as HTMLInputElement).value,
              class_id: (form.elements.namedItem('class_id') as HTMLSelectElement).value,
              parent_phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
              status: (form.elements.namedItem('status') as HTMLSelectElement).value,
            };

            setIsSaving(true);
            try {
              const { error } = selectedStudent
                ? await supabase.from("school_students").update(studentRecord).eq("id", selectedStudent.id)
                : await supabase.from("school_students").insert(studentRecord);
              if (error) throw error;

              toast.success(selectedStudent ? "Student updated." : "Student enrolled.");
              setIsDrawerOpen(false);
              setSelectedStudent(null);
              router.refresh();
            } catch (error) {
              toast.error(`Could not save student: ${error instanceof Error ? error.message : "Unexpected error"}`);
            } finally {
              setIsSaving(false);
            }
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input name="firstName" type="text" defaultValue={selectedStudent?.first_name || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input name="lastName" type="text" defaultValue={selectedStudent?.last_name || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Doe" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Roll Number</label>
              <input name="rollNumber" type="text" defaultValue={selectedStudent?.roll_number || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. R-101" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Class & Section</label>
              <select name="class_id" defaultValue={selectedStudent?.class_id || ""} required className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="">-- Select Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Parent/Guardian Phone</label>
              <input name="phone" type="tel" defaultValue={selectedStudent?.parent_phone || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
            </div>

            {selectedStudent && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Enrollment status</label>
                <select name="status" defaultValue={selectedStudent.status || "active"} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
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
                {selectedStudent ? "Save Changes" : "Admit Student"}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}

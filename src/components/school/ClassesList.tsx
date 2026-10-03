/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Drawer } from "@/components/admin/Drawer";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { describeError } from "@/lib/error-message";
import { compareClasses } from "@/lib/school-classes";
import { BulkClassesForm } from "@/components/school/BulkClassesForm";
import { SubjectsInput } from "@/components/school/SubjectsInput";

export function ClassesList({ initialData, teachers }: { initialData: any[], teachers: any[] }) {
  const router = useRouter();
  const canManage = useCanManage("classes");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editSubjects, setEditSubjects] = useState<string[]>([]);
  const classes = useMemo(() => [...initialData].sort(compareClasses), [initialData]);

  const openEdit = (classRecord: any) => {
    setSelectedClass(classRecord);
    setEditSubjects(classRecord.subjects ?? []);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (!window.confirm("Delete this class? Classes with enrolled students cannot be deleted.")) return;

    const supabase = createClient();
    const { count, error: studentsError } = await supabase
      .from("school_students")
      .select("id", { count: "exact", head: true })
      .eq("class_id", classId);

    if (studentsError) {
      toast.error(`Could not check class enrollment: ${studentsError.message}`);
      return;
    }
    if ((count ?? 0) > 0) {
      toast.error("Move or remove enrolled students before deleting this class.");
      return;
    }

    const { error } = await supabase.from("school_classes").delete().eq("id", classId);
    if (error) {
      toast.error(`Could not delete class: ${describeError(error)}`);
      return;
    }

    toast.success("Class deleted.");
    router.refresh();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.name}</span>,
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.section}</span>,
    },
    {
      accessorKey: "subjects",
      header: "Subjects",
      cell: ({ row }) => {
        const subjects: string[] = row.original.subjects ?? [];
        if (!subjects.length) return <span className="text-slate-400">Not set</span>;
        return (
          <span className="flex max-w-xs flex-wrap gap-1" title={subjects.join(", ")}>
            {subjects.slice(0, 3).map((subject) => <span key={subject} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700">{subject}</span>)}
            {subjects.length > 3 && <span className="px-1 py-0.5 text-xs font-semibold text-slate-500">+{subjects.length - 3} more</span>}
          </span>
        );
      },
    },
    {
      accessorKey: "class_teacher",
      header: "Class Teacher",
      cell: ({ row }) => {
        const teacher = row.original.school_teachers;
        return <span>{teacher ? `${teacher.first_name} ${teacher.last_name}` : "Not Assigned"}</span>;
      }
    },
    {
      accessorKey: "room_number",
      header: "Room Number",
      cell: ({ row }) => <span>{row.original.room_number || "N/A"}</span>,
    },
    {
      accessorKey: "student_count",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <Users className="h-4 w-4" />
          <span className="font-medium">{row.original.school_students?.[0]?.count ?? 0}</span>
        </div>
      )
    },
    ...(!canManage ? [] : [{
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => openEdit(row.original)}
            aria-label={`Edit ${row.original.name} ${row.original.section}`}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.original.id)}
            aria-label={`Delete ${row.original.name} ${row.original.section}`}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Classes & Sections</h1>
          <p className="text-sm font-medium text-slate-500">Manage academic structure and class assignments</p>
        </div>
        {canManage && <button
          onClick={() => setIsBulkOpen(true)}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Classes
        </button>}
      </div>

      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={classes} 
          searchKey="name" 
          searchPlaceholder="Search classes (e.g. Grade 10)..."
          disablePagination={false} 
        />
      </div>

      <Drawer isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} title="Add Classes" size="wide">
        {isBulkOpen && (
          <BulkClassesForm
            existing={classes}
            teachers={teachers}
            onCancel={() => setIsBulkOpen(false)}
            onDone={() => { setIsBulkOpen(false); router.refresh(); }}
          />
        )}
      </Drawer>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Edit Class"
      >
        <div className="p-6">
          <form key={selectedClass?.id || "new-class"} className="space-y-4" onSubmit={async (e) => { 
            e.preventDefault(); 
            if (isSaving) return;
            const form = e.target as HTMLFormElement;
            const supabase = createClient();
            
            const classRecord = {
              name: (form.elements.namedItem('name') as HTMLInputElement).value,
              section: (form.elements.namedItem('section') as HTMLInputElement).value,
              class_teacher_id: (form.elements.namedItem('teacher') as HTMLSelectElement).value || null,
              room_number: (form.elements.namedItem('room') as HTMLInputElement).value,
              subjects: editSubjects,
            };

            setIsSaving(true);
            try {
              const { error } = await supabase.from("school_classes").update(classRecord).eq("id", selectedClass.id);
              if (error) throw error;

              toast.success("Class updated.");
              setIsDrawerOpen(false);
              setSelectedClass(null);
              router.refresh();
            } catch (error) {
              toast.error(`Could not save class: ${describeError(error, "A class with that name and section already exists.")}`);
            } finally {
              setIsSaving(false);
            }
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Class/Grade Name</label>
                <input name="name" type="text" defaultValue={selectedClass?.name || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Class 10" maxLength={40} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Section</label>
                <input name="section" type="text" defaultValue={selectedClass?.section || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. A" maxLength={10} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Assign Class Teacher</label>
              <select name="teacher" defaultValue={selectedClass?.class_teacher_id || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-class-subjects" className="text-sm font-medium text-slate-700">Subjects</label>
              <SubjectsInput id="edit-class-subjects" label="Subjects" value={editSubjects} onChange={setEditSubjects} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Room Number</label>
              <input name="room" type="text" defaultValue={selectedClass?.room_number || ""} className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Room 101" maxLength={20} />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}

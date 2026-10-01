/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Drawer } from "@/components/admin/Drawer";

export function TeachersList({ initialData }: { initialData: any[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Teacher Name",
      cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.first_name} {row.original.last_name}</span>,
    },
    {
      accessorKey: "employee_id",
      header: "Employee ID",
    },
    {
      accessorKey: "subject",
      header: "Primary Subject",
      cell: ({ row }) => <span>{row.original.primary_subject || 'N/A'}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
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
            onClick={() => { setSelectedTeacher(row.original); setIsDrawerOpen(true); }}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teachers & Staff</h1>
          <p className="text-sm font-medium text-slate-500">Manage academic staff profiles and assignments</p>
        </div>
        <button
          onClick={() => { setSelectedTeacher(null); setIsDrawerOpen(true); }}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={initialData} 
          searchKey="name" 
          disablePagination={false} 
          filters={[
            {
              key: "subject",
              label: "All Subjects",
              options: [
                { label: "Mathematics", value: "Mathematics" },
                { label: "Physics", value: "Physics" },
                { label: "Computer Science", value: "Computer Science" },
              ]
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedTeacher ? "Edit Teacher Profile" : "Add New Teacher"}
      >
        <div className="p-6">
          <form className="space-y-4" onSubmit={async (e) => { 
            e.preventDefault(); 
            const form = e.target as HTMLFormElement;
            const supabase = (await import('@/lib/supabase-browser')).createClient();
            
            const newTeacher = {
              first_name: (form.elements.namedItem('firstName') as HTMLInputElement).value,
              last_name: (form.elements.namedItem('lastName') as HTMLInputElement).value,
              employee_id: (form.elements.namedItem('employeeId') as HTMLInputElement).value,
              primary_subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
              email: (form.elements.namedItem('email') as HTMLInputElement).value,
              phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
              status: 'active'
            };

            const { error } = await supabase.from('school_teachers').insert(newTeacher);
            if (error) {
              alert('Error saving teacher: ' + error.message);
            } else {
              window.location.reload();
            }
            setIsDrawerOpen(false); 
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input name="firstName" type="text" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Jane" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input name="lastName" type="text" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Smith" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Employee ID</label>
              <input name="employeeId" type="text" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. T-001" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Primary Subject</label>
              <select name="subject" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Computer Science</option>
                <option>English</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input name="email" type="email" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="teacher@school.edu" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input name="phone" type="tel" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" required />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm">
                {selectedTeacher ? "Save Changes" : "Add Teacher"}
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}

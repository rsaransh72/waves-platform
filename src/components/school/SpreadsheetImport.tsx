"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Download, FileSpreadsheet, TriangleAlert, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { describeError } from "@/lib/error-message";
import { formatIndianNumber } from "@/lib/india";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import {
  COLUMNS,
  MAX_IMPORT_ROWS,
  checkStudents,
  checkTeachers,
  classSectionKey,
  mapHeaders,
  type CheckedRow,
  type ImportKind,
  type SchoolClass,
  type StudentRow,
  type TeacherRow,
} from "@/lib/school-import";

const COPY: Record<ImportKind, { title: string; back: string; table: string; one: string; many: string; hint: string }> = {
  students: {
    title: "Import students",
    back: "/school/students",
    table: "school_students",
    one: "student",
    many: "students",
    hint: "One student per row. Class and section must match a class in Classes, or you can create the missing ones here.",
  },
  teachers: {
    title: "Import teachers",
    back: "/school/teachers",
    table: "school_teachers",
    one: "teacher",
    many: "teachers",
    hint: "One teacher per row. Employee IDs must be different for every teacher.",
  },
};

type Sheet = { fileName: string; headers: string[]; rows: unknown[][] };

// SheetJS is large; load it only when someone opens the importer and uses it.
const loadXlsx = () => import("xlsx");

export function SpreadsheetImport({ kind, classes: initialClasses, taken }: { kind: ImportKind; classes: SchoolClass[]; taken: string[] }) {
  const router = useRouter();
  const copy = COPY[kind];
  const canCreateClasses = useCanManage("classes");
  const [classes, setClasses] = useState(initialClasses);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [done, setDone] = useState<{ created: number; skipped: number } | null>(null);

  const takenSet = useMemo(() => new Set(taken.map((value) => value.toUpperCase())), [taken]);
  const mapped = useMemo(() => (sheet ? mapHeaders(kind, sheet.headers) : null), [kind, sheet]);
  const checked = useMemo<CheckedRow<StudentRow | TeacherRow>[]>(() => {
    if (!sheet || !mapped || mapped.missing.length) return [];
    return kind === "students" ? checkStudents(sheet.rows, mapped.mapping, classes, takenSet) : checkTeachers(sheet.rows, mapped.mapping, takenSet);
  }, [kind, sheet, mapped, classes, takenSet]);

  const ready = checked.filter((row) => row.record);
  const failing = checked.filter((row) => !row.record);
  const missingClasses = useMemo(() => {
    const unique = new Map<string, { name: string; section: string }>();
    for (const row of checked) {
      if (!row.missingClass) continue;
      const key = classSectionKey(row.missingClass.name, row.missingClass.section);
      if (!unique.has(key)) unique.set(key, row.missingClass);
    }
    return [...unique.values()];
  }, [checked]);

  const downloadTemplate = async () => {
    const XLSX = await loadXlsx();
    const columns = COLUMNS[kind];
    const sheetData = [columns.map((column) => column.label + (column.required ? " *" : "")), ...[0, 1].map((example) => columns.map((column) => column.example[example]))];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = columns.map(() => ({ wch: 18 }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, kind === "students" ? "Students" : "Teachers");
    XLSX.writeFile(workbook, `${kind}-import-template.xlsx`);
  };

  const readFile = async (file: File) => {
    setProblem(null);
    setDone(null);
    setSheet(null);
    setShowAll(false);
    if (file.size > 5 * 1024 * 1024) {
      setProblem("The file is larger than 5 MB. Keep only the needed columns and try again.");
      return;
    }
    try {
      const XLSX = await loadXlsx();
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const first = workbook.Sheets[workbook.SheetNames[0]];
      if (!first) throw new Error("The file has no sheets.");
      const table = XLSX.utils.sheet_to_json<unknown[]>(first, { header: 1, raw: true, defval: "", blankrows: false });
      const [headers = [], ...rows] = table;
      const filled = rows.filter((row) => row.some((value) => String(value ?? "").trim() !== ""));
      if (filled.length === 0) {
        setProblem("No rows found under the headings. Put one record per row, starting on row 2.");
        return;
      }
      if (filled.length > MAX_IMPORT_ROWS) {
        setProblem(`The file has ${formatIndianNumber(filled.length)} rows. Import at most ${formatIndianNumber(MAX_IMPORT_ROWS)} at a time; split the file by class.`);
        return;
      }
      // Template headings end with " *" on required columns.
      setSheet({ fileName: file.name, headers: headers.map((header) => String(header ?? "").replace(/\*\s*$/, "").trim()), rows: filled });
    } catch (error) {
      setProblem(`Could not read ${file.name}. Save it as .xlsx or .csv and try again. (${describeError(error)})`);
    }
  };

  const createMissingClasses = async () => {
    if (!missingClasses.length || isBusy) return;
    setIsBusy(true);
    const { data, error } = await createClient().from("school_classes").insert(missingClasses).select("id, name, section");
    setIsBusy(false);
    if (error) {
      toast.error(`Could not create the classes: ${describeError(error, "One of these classes already exists.")}`);
      return;
    }
    setClasses((current) => [...current, ...(data ?? [])]);
    toast.success(`Created ${data?.length ?? 0} ${data?.length === 1 ? "class" : "classes"}.`);
  };

  const importRows = async () => {
    if (!ready.length || isBusy) return;
    setIsBusy(true);
    // One insert: either every ready row is saved or none is.
    const { error, count } = await createClient().from(copy.table).insert(ready.map((row) => row.record!), { count: "exact" });
    setIsBusy(false);
    if (error) {
      toast.error(`Nothing was imported: ${describeError(error, kind === "students" ? "A roll number in the file is already used." : "An employee ID in the file is already used.")}`);
      return;
    }
    setDone({ created: count ?? ready.length, skipped: failing.length });
    setSheet(null);
    router.refresh();
  };

  const visible = showAll ? checked : [...failing, ...ready].slice(0, 50);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href={copy.back} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{copy.hint}</p>
      </div>

      <ol className="grid gap-4 md:grid-cols-2">
        <li className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 1</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">Fill in the template</h2>
          <p className="mt-1 text-sm text-slate-500">Columns: {COLUMNS[kind].map((column) => column.label + (column.required ? "*" : "")).join(", ")}. Your own sheet works too if it has these headings.</p>
          <button type="button" onClick={() => void downloadTemplate()} className="mt-4 inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Download Excel template
          </button>
        </li>
        <li className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 2</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">Choose the file</h2>
          <p className="mt-1 text-sm text-slate-500">Excel (.xlsx, .xls) or CSV. Only the first sheet is read. Nothing is saved until you press Import.</p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 focus-within:ring-2 focus-within:ring-blue-300">
            <Upload className="h-4 w-4" /> Choose file
            <input
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="sr-only"
              onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); event.target.value = ""; }}
            />
          </label>
        </li>
      </ol>

      {problem && (
        <div role="alert" className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <TriangleAlert className="h-5 w-5 shrink-0" /> <p>{problem}</p>
        </div>
      )}

      {done && (
        <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="flex-1">
            {formatIndianNumber(done.created)} {done.created === 1 ? copy.one : copy.many} imported.
            {done.skipped > 0 && ` ${formatIndianNumber(done.skipped)} rows with errors were left out; fix them in the file and import it again.`}
          </p>
          <Link href={copy.back} className="font-semibold underline">See the list</Link>
        </div>
      )}

      {sheet && mapped && (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            <p className="flex-1 text-sm text-slate-700"><span className="font-semibold">{sheet.fileName}</span> · {formatIndianNumber(sheet.rows.length)} rows</p>
          </div>

          {mapped.missing.length > 0 ? (
            <div role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              The first row must have these headings: <b>{mapped.missing.join(", ")}</b>. Found: {sheet.headers.filter(Boolean).join(", ") || "no headings"}. Download the template to see the layout.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">{formatIndianNumber(ready.length)} ready</span>
                {failing.length > 0 && <span className="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-800">{formatIndianNumber(failing.length)} with errors</span>}
              </div>

              {missingClasses.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="flex-1">
                    {missingClasses.length === 1 ? "1 class in the file does not exist yet" : `${missingClasses.length} classes in the file do not exist yet`}: {missingClasses.slice(0, 8).map((item) => `${item.name} - ${item.section}`).join(", ")}{missingClasses.length > 8 ? "…" : ""}.
                  </p>
                  {canCreateClasses ? (
                    <button type="button" disabled={isBusy} onClick={() => void createMissingClasses()} className="rounded bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
                      Create {missingClasses.length === 1 ? "it" : `these ${missingClasses.length}`}
                    </button>
                  ) : (
                    <p className="w-full">Ask a school administrator to add them in Classes, then choose the file again.</p>
                  )}
                </div>
              )}

              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Row</th>
                      {COLUMNS[kind].map((column) => <th key={column.key} className="px-3 py-2">{column.label}</th>)}
                      <th className="px-3 py-2">Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((row) => (
                      <tr key={row.line} className={row.record ? "" : "bg-red-50/50"}>
                        <td className="px-3 py-2 tabular-nums text-slate-500">{row.line}</td>
                        {COLUMNS[kind].map((column) => <td key={column.key} className="px-3 py-2 text-slate-800">{row.values[column.key] || <span className="text-slate-300">—</span>}</td>)}
                        <td className="px-3 py-2">{row.record ? <span className="font-semibold text-emerald-700">Ready</span> : <span className="text-red-700">{row.errors.join(" ")}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showAll && checked.length > visible.length && (
                <button type="button" onClick={() => setShowAll(true)} className="text-sm font-semibold text-blue-700 hover:underline">Show all {formatIndianNumber(checked.length)} rows</button>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
                {failing.length > 0 && ready.length > 0 && <p className="text-sm text-slate-500">Rows with errors are left out.</p>}
                <button type="button" disabled={!ready.length || isBusy} onClick={() => void importRows()} className="rounded bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {isBusy ? "Importing…" : `Import ${formatIndianNumber(ready.length)} ${ready.length === 1 ? copy.one : copy.many}`}
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

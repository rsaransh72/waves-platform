"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { describeError } from "@/lib/error-message";
import { CLASS_GROUPS, LIMITS, SECTION_PRESETS, addUnique, classKey, compareClasses, suggestedSubjects } from "@/lib/school-classes";
import { SubjectsInput } from "@/components/school/SubjectsInput";

type Teacher = { id: string; first_name: string; last_name: string };
type RowDetails = { teacherId: string; room: string };

const chip = (selected: boolean) =>
  `inline-flex h-8 items-center gap-1 rounded border px-3 text-sm font-semibold transition-colors ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700"}`;
const inputClass = "h-9 w-full rounded border border-slate-300 px-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

// Adds many classes in one go: choose class names and sections, adjust each class's
// subjects, optionally set a class teacher and room per section, and save together.
export function BulkClassesForm({ existing, teachers, onDone, onCancel }: {
  existing: { name: string; section: string }[];
  teachers: Teacher[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [names, setNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>(["A"]);
  const [subjects, setSubjects] = useState<Record<string, string[]>>({});
  const [details, setDetails] = useState<Record<string, RowDetails>>({});
  const [customName, setCustomName] = useState("");
  const [customSection, setCustomSection] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const existingKeys = useMemo(() => new Set(existing.map((item) => classKey(item.name, item.section))), [existing]);
  const sortedNames = useMemo(() => [...names].sort((left, right) => compareClasses({ name: left }, { name: right })), [names]);
  const sortedSections = useMemo(() => [...sections].sort((left, right) => left.localeCompare(right, undefined, { numeric: true })), [sections]);
  const newRows = sortedNames.flatMap((name) => sortedSections.filter((section) => !existingKeys.has(classKey(name, section))).map((section) => ({ name, section })));
  const skipped = sortedNames.length * sortedSections.length - newRows.length;

  const subjectsFor = (name: string) => subjects[name.toLowerCase()] ?? suggestedSubjects(name);
  const setSubjectsFor = (name: string, value: string[]) => setSubjects((current) => ({ ...current, [name.toLowerCase()]: value }));
  const detailsFor = (name: string, section: string) => details[classKey(name, section)] ?? { teacherId: "", room: "" };
  const setDetailsFor = (name: string, section: string, change: Partial<RowDetails>) =>
    setDetails((current) => ({ ...current, [classKey(name, section)]: { ...detailsFor(name, section), ...change } }));

  const toggleName = (name: string) =>
    setNames((current) => current.some((item) => item.toLowerCase() === name.toLowerCase()) ? current.filter((item) => item.toLowerCase() !== name.toLowerCase()) : [...current, name]);
  const toggleGroup = (group: string[]) => {
    const allSelected = group.every((name) => names.includes(name));
    setNames((current) => allSelected ? current.filter((name) => !group.includes(name)) : [...current, ...group.filter((name) => !current.includes(name))]);
  };
  const toggleSection = (section: string) =>
    setSections((current) => current.includes(section) ? current.filter((item) => item !== section) : [...current, section]);

  const addCustomName = () => {
    setNames((current) => addUnique(current, customName, LIMITS.name));
    setCustomName("");
  };
  const addCustomSection = () => {
    setSections((current) => addUnique(current, customSection.toUpperCase(), LIMITS.section));
    setCustomSection("");
  };
  const copySubjectsToAll = (from: string) => {
    const value = subjectsFor(from);
    setSubjects(Object.fromEntries(names.map((name) => [name.toLowerCase(), value])));
    toast.success(`${from}'s subjects copied to all ${names.length} classes.`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newRows.length || isSaving) return;
    setIsSaving(true);
    const records = newRows.map(({ name, section }) => {
      const row = detailsFor(name, section);
      return { name, section, subjects: subjectsFor(name), class_teacher_id: row.teacherId || null, room_number: row.room.trim() || null };
    });
    // One insert: either every class is created or none is.
    const { error } = await createClient().from("school_classes").insert(records);
    setIsSaving(false);
    if (error) {
      toast.error(`Could not add the classes: ${describeError(error, "One of these classes was just added by someone else. Close this and try again.")}`);
      return;
    }
    toast.success(`${records.length} ${records.length === 1 ? "class" : "classes"} added.`);
    onDone();
  };

  const onEnter = (action: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      action();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
      <div className="flex-1 space-y-8 pb-6">
        <section aria-labelledby="bulk-classes-step">
          <h3 id="bulk-classes-step" className="text-sm font-bold text-slate-900">1. Choose classes</h3>
          <p className="mt-1 text-xs text-slate-500">Click a group name to select all of it.</p>
          <div className="mt-3 space-y-3">
            {CLASS_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => toggleGroup(group.classes)} className="w-32 shrink-0 text-left text-xs font-bold uppercase tracking-wide text-slate-500 underline decoration-dotted underline-offset-4 hover:text-blue-700">
                  {group.label}
                </button>
                {group.classes.map((name) => (
                  <button key={name} type="button" aria-pressed={names.includes(name)} onClick={() => toggleName(name)} className={chip(names.includes(name))}>
                    {names.includes(name) && <Check className="h-3.5 w-3.5" />}{name}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-32 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500">Other</span>
              {names.filter((name) => !CLASS_GROUPS.some((group) => group.classes.includes(name))).map((name) => (
                <button key={name} type="button" aria-pressed onClick={() => toggleName(name)} className={chip(true)}>
                  <Check className="h-3.5 w-3.5" />{name}
                </button>
              ))}
              <span className="flex gap-1.5">
                <input value={customName} onChange={(event) => setCustomName(event.target.value)} onKeyDown={onEnter(addCustomName)} maxLength={LIMITS.name} placeholder="e.g. Play Group" aria-label="Other class name" className={`${inputClass} h-8 w-40`} />
                <button type="button" onClick={addCustomName} disabled={!customName.trim()} className="inline-flex h-8 items-center gap-1 rounded border border-slate-300 px-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                  <Plus className="h-3.5 w-3.5" />Add
                </button>
              </span>
            </div>
          </div>
        </section>

        <section aria-labelledby="bulk-sections-step">
          <h3 id="bulk-sections-step" className="text-sm font-bold text-slate-900">2. Sections in every class</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[...new Set([...SECTION_PRESETS, ...sections])].map((section) => (
              <button key={section} type="button" aria-pressed={sections.includes(section)} onClick={() => toggleSection(section)} className={chip(sections.includes(section))}>
                {sections.includes(section) && <Check className="h-3.5 w-3.5" />}{section}
              </button>
            ))}
            <span className="flex gap-1.5">
              <input value={customSection} onChange={(event) => setCustomSection(event.target.value)} onKeyDown={onEnter(addCustomSection)} maxLength={LIMITS.section} placeholder="e.g. Rose" aria-label="Other section name" className={`${inputClass} h-8 w-28`} />
              <button type="button" onClick={addCustomSection} disabled={!customSection.trim()} className="inline-flex h-8 items-center gap-1 rounded border border-slate-300 px-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                <Plus className="h-3.5 w-3.5" />Add
              </button>
            </span>
          </div>
        </section>

        <section aria-labelledby="bulk-review-step">
          <h3 id="bulk-review-step" className="text-sm font-bold text-slate-900">3. Subjects, class teachers and rooms</h3>
          {!sortedNames.length || !sortedSections.length ? (
            <p className="mt-3 rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500">Choose at least one class and one section.</p>
          ) : (
            <>
              <p className="mt-1 text-xs text-slate-500">Subjects are suggested for each level; change them as needed. Class teacher and room are optional.</p>
              <div className="mt-3 space-y-4">
                {sortedNames.map((name, index) => (
                  <div key={name} className="rounded border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                      <p className="font-bold text-slate-900">{name}</p>
                      {sortedNames.length > 1 && (
                        <button type="button" onClick={() => copySubjectsToAll(name)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
                          <Copy className="h-3.5 w-3.5" />Use these subjects for all classes
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <label htmlFor={`subjects-${index}`} className="mb-1 block text-xs font-semibold text-slate-600">Subjects ({subjectsFor(name).length})</label>
                        <SubjectsInput id={`subjects-${index}`} label={`${name} subjects`} value={subjectsFor(name)} onChange={(value) => setSubjectsFor(name, value)} />
                      </div>
                      <div className="divide-y divide-slate-100">
                        {sortedSections.map((section) => {
                          const exists = existingKeys.has(classKey(name, section));
                          const row = detailsFor(name, section);
                          return (
                            <div key={section} className="grid grid-cols-[3.5rem_1fr] items-center gap-2 py-2 sm:grid-cols-[3.5rem_1fr_9rem]">
                              <span className="text-sm font-bold text-slate-700">{section}</span>
                              {exists ? (
                                <span className="text-sm text-slate-500 sm:col-span-2">Already added — will be skipped</span>
                              ) : (
                                <>
                                  <select value={row.teacherId} onChange={(event) => setDetailsFor(name, section, { teacherId: event.target.value })} aria-label={`${name} ${section} class teacher`} className={inputClass}>
                                    <option value="">Class teacher (optional)</option>
                                    {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>)}
                                  </select>
                                  <input value={row.room} onChange={(event) => setDetailsFor(name, section, { room: event.target.value })} maxLength={LIMITS.room} placeholder="Room (optional)" aria-label={`${name} ${section} room`} className={`${inputClass} col-start-2 sm:col-start-auto`} />
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="sticky -bottom-6 -mx-6 -mb-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
        <p className="text-sm text-slate-600" role="status">
          <strong className="text-slate-900">{newRows.length}</strong> {newRows.length === 1 ? "class" : "classes"} to add
          {skipped > 0 && <> · {skipped} already added</>}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={!newRows.length || isSaving} className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
            {isSaving ? "Adding..." : newRows.length ? `Add ${newRows.length} ${newRows.length === 1 ? "class" : "classes"}` : "Add classes"}
          </button>
        </div>
      </div>
    </form>
  );
}

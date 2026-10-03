"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import { LIMITS, addUnique } from "@/lib/school-classes";

// Subjects as removable chips; type a subject and press Enter or comma to add it.
export function SubjectsInput({ value, onChange, label, id }: { value: string[]; onChange: (subjects: string[]) => void; label: string; id: string }) {
  const [draft, setDraft] = useState("");
  const full = value.length >= LIMITS.subjects;

  const commit = () => {
    if (!draft.trim()) return;
    onChange(addUnique(value, draft, LIMITS.subject));
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded border border-slate-300 bg-white px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      {value.map((subject) => (
        <span key={subject} className="inline-flex items-center gap-1 rounded bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-semibold text-blue-800">
          {subject}
          <button type="button" onClick={() => onChange(value.filter((item) => item !== subject))} aria-label={`Remove ${subject} from ${label}`} className="rounded p-0.5 text-blue-500 hover:bg-blue-100 hover:text-blue-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        aria-label={label}
        value={draft}
        disabled={full}
        onChange={(event) => setDraft(event.target.value.replace(",", ""))}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        maxLength={LIMITS.subject}
        placeholder={full ? `Up to ${LIMITS.subjects} subjects` : value.length ? "Add subject" : "Type a subject, press Enter"}
        className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

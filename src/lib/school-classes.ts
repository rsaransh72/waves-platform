// Class names, sections and subjects: presets for adding many classes at once, the
// subjects usually taught at each level (a starting point the school edits), and the
// order classes are listed in (Nursery, LKG, UKG, Class 1 ... Class 12).

export const CLASS_GROUPS: { label: string; classes: string[] }[] = [
  { label: "Pre-primary", classes: ["Nursery", "LKG", "UKG"] },
  { label: "Primary", classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { label: "Middle", classes: ["Class 6", "Class 7", "Class 8"] },
  { label: "Secondary", classes: ["Class 9", "Class 10"] },
  { label: "Senior secondary", classes: ["Class 11", "Class 12"] },
];

export const SECTION_PRESETS = ["A", "B", "C", "D", "E", "F"];

export const LIMITS = { name: 40, section: 10, subject: 60, subjects: 30, room: 20 };

const PRE_PRIMARY = ["Nursery", "LKG", "UKG", "Pre-Nursery", "Play Group"];

// Typical Indian school subjects by level, to edit before saving.
export function suggestedSubjects(className: string): string[] {
  const grade = gradeNumber(className);
  if (grade === null) {
    return PRE_PRIMARY.some((name) => name.toLowerCase() === className.trim().toLowerCase())
      ? ["English", "Hindi", "Mathematics", "EVS", "Drawing"]
      : [];
  }
  if (grade <= 5) return ["English", "Hindi", "Mathematics", "EVS", "Computer", "General Knowledge"];
  if (grade <= 8) return ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer"];
  if (grade <= 10) return ["English", "Hindi", "Mathematics", "Science", "Social Science", "Information Technology"];
  return ["English", "Physics", "Chemistry", "Mathematics", "Biology", "Physical Education"];
}

// "Class 10", "Grade 10", "10th", "X" → 10.
function gradeNumber(className: string): number | null {
  const value = className.trim();
  const digits = value.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/i);
  if (digits) return Number(digits[1]);
  const roman = value.match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/);
  if (!roman) return null;
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].indexOf(roman[1]) + 1;
}

function classRank(className: string) {
  const preIndex = PRE_PRIMARY.map((name) => name.toLowerCase()).indexOf(className.trim().toLowerCase());
  if (preIndex >= 0) return [0, ["Play Group", "Pre-Nursery", "Nursery", "LKG", "UKG"].indexOf(PRE_PRIMARY[preIndex])];
  const grade = gradeNumber(className);
  return grade === null ? [2, 0] : [1, grade];
}

export function compareClasses(left: { name: string; section?: string | null }, right: { name: string; section?: string | null }) {
  const [leftGroup, leftOrder] = classRank(left.name);
  const [rightGroup, rightOrder] = classRank(right.name);
  return leftGroup - rightGroup
    || leftOrder - rightOrder
    || left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: "base" })
    || (left.section ?? "").localeCompare(right.section ?? "", undefined, { numeric: true, sensitivity: "base" });
}

// Adds a value to a list unless it is already there, ignoring case and spaces.
export function addUnique(list: string[], value: string, max: number) {
  const clean = value.trim().replace(/\s+/g, " ").slice(0, max);
  if (!clean || list.some((item) => item.toLowerCase() === clean.toLowerCase())) return list;
  return [...list, clean];
}

export const classKey = (name: string, section: string) => `${name.trim().toLowerCase()}|${section.trim().toLowerCase()}`;

// Rules for importing students and teachers from a spreadsheet. Each row is checked
// with the same rules as the single-entry forms, so an import can never save what
// the form would refuse. The importer shows these errors per row before saving.
import { emailError, personNameError, phoneError, textError, toStoredPhone } from "@/lib/india";
import { codeError, dateOfBirthError, parseBloodGroup, parseCategory, parseGender, parseSheetDate } from "@/lib/school-students";

export type ImportKind = "students" | "teachers";
export const MAX_IMPORT_ROWS = 3000;

// `preview: false` columns are read and checked but left out of the preview table.
type Column = { key: string; label: string; required: boolean; aliases: string[]; example: [string, string]; preview?: boolean };

export const COLUMNS: Record<ImportKind, Column[]> = {
  students: [
    { key: "firstName", label: "First name", required: true, aliases: ["first name", "firstname", "first", "given name", "student first name"], example: ["Aarav", "Diya"] },
    { key: "lastName", label: "Last name", required: false, aliases: ["last name", "lastname", "surname", "last", "family name", "student last name"], example: ["Sharma", "Iyer"] },
    { key: "admissionNumber", label: "Admission number", required: false, aliases: ["admission number", "admission no", "admission no.", "adm no", "adm no.", "sr no", "s r no", "scholar no", "scholar number", "enrollment no"], example: ["2026/0412", "2026/0413"] },
    { key: "rollNumber", label: "Roll number", required: true, aliases: ["roll number", "roll no", "roll no.", "roll", "rollno", "roll_number"], example: ["1", "2"] },
    { key: "className", label: "Class", required: true, aliases: ["class", "grade", "standard", "std", "class name"], example: ["Class 5", "Class 5"] },
    { key: "section", label: "Section", required: true, aliases: ["section", "sec", "division", "div"], example: ["A", "A"] },
    { key: "dateOfBirth", label: "Date of birth", required: false, aliases: ["date of birth", "dob", "d o b", "birth date", "birthdate"], example: ["14-08-2015", "02-01-2016"], preview: false },
    { key: "gender", label: "Gender", required: false, aliases: ["gender", "sex"], example: ["Male", "Female"], preview: false },
    { key: "fatherName", label: "Father's name", required: false, aliases: ["father s name", "father name", "father", "fathers name"], example: ["Rakesh Sharma", "Suresh Iyer"], preview: false },
    { key: "motherName", label: "Mother's name", required: false, aliases: ["mother s name", "mother name", "mother", "mothers name"], example: ["Neha Sharma", "Lakshmi Iyer"], preview: false },
    { key: "parentMobile", label: "Parent mobile", required: false, aliases: ["parent mobile", "parent phone", "mobile", "phone", "father mobile", "mother mobile", "guardian mobile", "contact"], example: ["98765 43210", ""] },
    { key: "address", label: "Address", required: false, aliases: ["address", "residential address", "home address"], example: ["12 MG Road, Jaipur 302001", ""], preview: false },
    { key: "category", label: "Category", required: false, aliases: ["category", "caste category", "social category", "caste"], example: ["General", "OBC"], preview: false },
    { key: "bloodGroup", label: "Blood group", required: false, aliases: ["blood group", "blood", "bloodgroup"], example: ["B+", "O+"], preview: false },
  ],
  teachers: [
    { key: "firstName", label: "First name", required: true, aliases: ["first name", "firstname", "first", "given name"], example: ["Priya", "Rakesh"] },
    { key: "lastName", label: "Last name", required: false, aliases: ["last name", "lastname", "surname", "last", "family name"], example: ["Verma", "Nair"] },
    { key: "employeeId", label: "Employee ID", required: true, aliases: ["employee id", "employee no", "emp id", "emp no", "staff id", "id", "employee_id"], example: ["T-001", "T-002"] },
    { key: "subject", label: "Subject", required: false, aliases: ["subject", "primary subject", "teaches"], example: ["Mathematics", "Science"] },
    { key: "email", label: "Email", required: false, aliases: ["email", "email address", "e-mail", "mail"], example: ["priya.verma@school.in", ""] },
    { key: "mobile", label: "Mobile", required: false, aliases: ["mobile", "phone", "mobile number", "contact"], example: ["98765 43211", ""] },
  ],
};

const squash = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Which spreadsheet column holds which field, matched on header text. Returns the
// missing required fields so the importer can say which headings to add.
export function mapHeaders(kind: ImportKind, headers: string[]) {
  const mapping: Record<string, number> = {};
  const normalized = headers.map((header) => squash(String(header ?? "")));
  for (const column of COLUMNS[kind]) {
    const candidates = [column.label, ...column.aliases].map(squash);
    const index = normalized.findIndex((header) => candidates.includes(header));
    if (index >= 0) mapping[column.key] = index;
  }
  const missing = COLUMNS[kind].filter((column) => column.required && mapping[column.key] === undefined).map((column) => column.label);
  return { mapping, missing };
}

const ROMAN: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5", vi: "6", vii: "7", viii: "8", ix: "9", x: "10", xi: "11", xii: "12" };

// "Class VIII", "Std 8", "8th" and "Grade 8" all mean the same class.
export function classKey(name: string) {
  const words = squash(name).split(" ").filter((word) => !["class", "std", "standard", "grade"].includes(word));
  return words.map((word) => ROMAN[word] ?? word.replace(/^(\d+)(st|nd|rd|th)$/, "$1")).join(" ");
}
export function classSectionKey(name: string, section: string) {
  return `${classKey(name)}|${squash(section)}`;
}

// How a class from the file is named when the importer creates it: numbered classes
// always as "Class 8" (from "8", "VIII", "Std 8" or "8th"); others such as "Nursery"
// or "LKG" as typed.
export function classDisplayName(name: string) {
  const key = classKey(name);
  return /^\d{1,2}$/.test(key) ? `Class ${key}` : name.trim();
}

export type SchoolClass = { id: string; name: string; section: string };

export type StudentRow = {
  first_name: string;
  last_name: string;
  admission_number: string | null;
  roll_number: string;
  class_id: string;
  date_of_birth: string | null;
  gender: string | null;
  father_name: string | null;
  mother_name: string | null;
  parent_phone: string | null;
  address: string | null;
  category: string | null;
  blood_group: string | null;
};

// Roll numbers repeat across classes; this is how one is identified in a school.
export const rollKey = (classId: string, roll: string) => `${classId}|${roll.toUpperCase()}`;
export type TeacherRow = { first_name: string; last_name: string; employee_id: string; primary_subject: string | null; email: string | null; phone: string | null };

export type CheckedRow<T> = {
  line: number; // spreadsheet row number, counting the heading as row 1
  values: Record<string, string>;
  record: T | null;
  errors: string[];
  // A class that does not exist yet ("Class 6 - C"); it can be created from the importer.
  missingClass?: { name: string; section: string };
};

const cell = (row: unknown[], index: number | undefined) => (index === undefined ? "" : String(row[index] ?? "").trim());

export function checkStudents(rows: unknown[][], mapping: Record<string, number>, classes: SchoolClass[], takenRolls: Set<string>, takenAdmissions: Set<string>): CheckedRow<StudentRow>[] {
  const classByKey = new Map(classes.map((schoolClass) => [classSectionKey(schoolClass.name, schoolClass.section), schoolClass]));
  const seenRolls = new Map<string, number>();
  const seenAdmissions = new Map<string, number>();
  return rows.map((row, index) => {
    const line = index + 2;
    const values = Object.fromEntries(COLUMNS.students.map((column) => [column.key, cell(row, mapping[column.key])]));
    const errors: string[] = [];
    const first = personNameError(values.firstName);
    if (first) errors.push(`First name: ${first}`);
    for (const [key, label] of [["lastName", "Last name"], ["fatherName", "Father's name"], ["motherName", "Mother's name"]] as const) {
      const problem = values[key] ? personNameError(values[key], false) : null;
      if (problem) errors.push(`${label}: ${problem}`);
    }

    let classId: string | null = null;
    let matchedLabel = "";
    let missingClass: CheckedRow<StudentRow>["missingClass"];
    if (!values.className || !values.section) {
      errors.push("Class and section are required.");
    } else {
      const schoolClass = classByKey.get(classSectionKey(values.className, values.section));
      if (schoolClass) {
        classId = schoolClass.id;
        matchedLabel = `${schoolClass.name} - ${schoolClass.section}`;
      } else {
        missingClass = { name: classDisplayName(values.className), section: values.section.toUpperCase() };
        errors.push(`${missingClass.name} - ${missingClass.section} does not exist yet.`);
      }
    }

    const roll = values.rollNumber.toUpperCase();
    const rollProblem = codeError(roll, "Roll number");
    const classLabel = matchedLabel || (missingClass ? `${missingClass.name} - ${missingClass.section}` : `${values.className} - ${values.section}`);
    const seenKey = `${classSectionKey(values.className, values.section)}|${roll}`;
    if (rollProblem) errors.push(rollProblem);
    else if (classId && takenRolls.has(rollKey(classId, roll))) errors.push(`Roll number ${roll} is already used in ${classLabel}.`);
    else if (seenRolls.has(seenKey)) errors.push(`Roll number ${roll} in ${classLabel} is also on row ${seenRolls.get(seenKey)}.`);
    if (!rollProblem && !seenRolls.has(seenKey)) seenRolls.set(seenKey, line);

    const admission = values.admissionNumber.toUpperCase();
    const admissionProblem = codeError(admission, "Admission number", false);
    if (admissionProblem) errors.push(admissionProblem);
    else if (admission && takenAdmissions.has(admission)) errors.push(`Admission number ${admission} is already used.`);
    else if (admission && seenAdmissions.has(admission)) errors.push(`Admission number ${admission} is also on row ${seenAdmissions.get(admission)}.`);
    if (admission && !admissionProblem && !seenAdmissions.has(admission)) seenAdmissions.set(admission, line);

    const dateOfBirth = parseSheetDate(mapping.dateOfBirth === undefined ? "" : row[mapping.dateOfBirth]);
    if (dateOfBirth === undefined) errors.push("Date of birth: write it as DD-MM-YYYY.");
    else {
      const problem = dateOfBirthError(dateOfBirth);
      if (problem) errors.push(`Date of birth: ${problem}`);
      else if (dateOfBirth) values.dateOfBirth = dateOfBirth.split("-").reverse().join("-");
    }
    const gender = parseGender(values.gender);
    if (gender === undefined) errors.push("Gender: use Male, Female or Other.");
    const category = parseCategory(values.category);
    if (category === undefined) errors.push("Category: use General, EWS, OBC, SC or ST.");
    const bloodGroup = parseBloodGroup(values.bloodGroup);
    if (bloodGroup === undefined) errors.push("Blood group: use A+, A-, B+, B-, AB+, AB-, O+ or O-.");
    const address = textError(values.address, { label: "Address", min: 5, max: 250 });
    if (address) errors.push(address);
    const phone = phoneError(values.parentMobile);
    if (phone) errors.push(`Parent mobile: ${phone}`);

    const record = errors.length === 0 && classId
      ? {
          first_name: values.firstName,
          last_name: values.lastName,
          admission_number: admission || null,
          roll_number: roll,
          class_id: classId,
          date_of_birth: dateOfBirth ?? null,
          gender: gender ?? null,
          father_name: values.fatherName || null,
          mother_name: values.motherName || null,
          parent_phone: toStoredPhone(values.parentMobile),
          address: values.address || null,
          category: category ?? null,
          blood_group: bloodGroup ?? null,
        }
      : null;
    return { line, values, record, errors, missingClass };
  });
}

export function checkTeachers(rows: unknown[][], mapping: Record<string, number>, takenIds: Set<string>): CheckedRow<TeacherRow>[] {
  const seenIds = new Map<string, number>();
  return rows.map((row, index) => {
    const values = Object.fromEntries(COLUMNS.teachers.map((column) => [column.key, cell(row, mapping[column.key])]));
    const errors: string[] = [];
    const first = personNameError(values.firstName);
    if (first) errors.push(`First name: ${first}`);
    const last = values.lastName ? personNameError(values.lastName, false) : null;
    if (last) errors.push(`Last name: ${last}`);
    const id = values.employeeId.toUpperCase();
    const idProblem = codeError(id, "Employee ID");
    if (idProblem) errors.push(idProblem);
    else if (takenIds.has(id)) errors.push(`Employee ID ${id} is already used in this school.`);
    else if (seenIds.has(id)) errors.push(`Employee ID ${id} is also on row ${seenIds.get(id)}.`);
    if (!idProblem) seenIds.set(id, index + 2);
    const subject = textError(values.subject, { label: "Subject", max: 60 });
    if (subject) errors.push(subject);
    const email = emailError(values.email);
    if (email) errors.push(`Email: ${email}`);
    const phone = phoneError(values.mobile);
    if (phone) errors.push(`Mobile: ${phone}`);

    const record = errors.length === 0
      ? { first_name: values.firstName, last_name: values.lastName, employee_id: id, primary_subject: values.subject || null, email: values.email.toLowerCase() || null, phone: toStoredPhone(values.mobile) }
      : null;
    return { line: index + 2, values, record, errors };
  });
}

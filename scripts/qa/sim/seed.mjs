// Seeds the five schools that "already use" the ERP: each has been a client for about
// three weeks, with staff, classes, students, fee plans, some attendance history and
// a principal who signs in with a password. Everything is tagged "qasim" for cleanup.
//
// Usage: node scripts/qa/sim/seed.mjs
import { PASSWORD, TAG, alias, service, writeJson } from "./lib.mjs";

const FIRST = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Ananya", "Diya", "Aadhya", "Saanvi", "Pari", "Anika", "Navya", "Myra", "Sara", "Ira", "Kabir", "Rohan", "Dev", "Tanvi", "Meera", "Riya", "Kavya", "Nikhil", "Harsh", "Pooja", "Zoya", "Aryan", "Lakshmi", "Gurleen", "Farhan", "Neel"];
const LAST = ["Sharma", "Verma", "Gupta", "Singh", "Patel", "Iyer", "Nair", "Reddy", "Khan", "Joshi", "Mishra", "Yadav", "Das", "Bose", "Kulkarni", "Chauhan", "Agarwal", "Pandey", "Menon", "Shaikh"];
const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Social Science", "Computer Science", "Physical Education", "Sanskrit"];
const pick = (list, index) => list[index % list.length];
const phone = (n) => `+9190000${String(n).padStart(5, "0")}`;
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

export const SCHOOLS = [
  { key: "s1", name: "Greenfield Public School", city: "Jaipur", state: "Rajasthan", pincode: "302017", principal: "Anjali Mehta", plan: "School ERP – Standard", amount: 60000, status: "active", classes: [["Class 1", "A", 32], ["Class 5", "A", 28], ["Class 8", "B", 24], ["Class 10", "A", 20]] },
  { key: "s2", name: "St. Xavier's Convent School", city: "Bhopal", state: "Madhya Pradesh", pincode: "462001", principal: "Thomas Mathew", plan: "School ERP – Standard", amount: 72000, status: "active", classes: [["Class 6", "A", 22], ["Class 9", "A", 18], ["Class 10", "A", 25]] },
  { key: "s3", name: "Saraswati Vidya Mandir", city: "Varanasi", state: "Uttar Pradesh", pincode: "221005", principal: "Om Prakash Tiwari", plan: "School ERP – Basic", amount: 30000, status: "active", classes: [["Class 3", "A", 26], ["Class 5", "A", 30]] },
  { key: "s4", name: "Little Angels School", city: "Indore", state: "Madhya Pradesh", pincode: "452010", principal: "Fatima Sheikh", plan: "School ERP – Standard", amount: 54000, status: "active", classes: [["Class 2", "A", 20], ["Class 4", "B", 18], ["Class 8", "B", 22]] },
  { key: "s5", name: "Delhi Heights Academy", city: "Gurugram", state: "Haryana", pincode: "122018", principal: "Karan Malhotra", plan: "School ERP – Premium", amount: 120000, status: "past_due", classes: [["Class 7", "A", 24], ["Class 11", "Science", 16]] },
];

async function insert(table, rows) {
  const { data, error } = await service.from(table).insert(rows).select();
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

async function seedSchool(school, index) {
  const email = alias(`principal-${school.key}`);
  const createdAt = new Date(Date.now() - (21 + index * 3) * 86400000).toISOString();
  const [organization] = await insert("organizations", [{
    name: school.name, slug: `${TAG}-${school.key}-${school.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.slice(0, 60).replace(/-+$/, ""), type: "school", email,
    phone: phone(100 + index), address: `${12 + index}, Main Road`, city: school.city, state: school.state, pincode: school.pincode, status: "active", created_at: createdAt,
  }]);
  const organizationId = organization.id;

  await insert("school_settings", [{ organization_id: organizationId, school_name: school.name, contact_email: email, contact_phone: phone(100 + index), address: `${12 + index}, Main Road, ${school.city}` }]);
  const billing = school.status === "past_due" ? new Date(Date.now() - 6 * 86400000) : new Date(Date.now() + 330 * 86400000);
  await insert("subscriptions", [{ organization_id: organizationId, organization_name: school.name, plan_name: school.plan, amount: school.amount, status: school.status, next_billing_date: billing.toISOString(), created_at: createdAt }]);

  const { data: created, error: userError } = await service.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true, user_metadata: { full_name: school.principal } });
  if (userError) throw new Error(`user ${email}: ${userError.message}`);
  await insert("organization_members", [{ organization_id: organizationId, user_id: created.user.id, role: "admin" }]);

  const teachers = await insert("school_teachers", Array.from({ length: 6 }, (_, t) => ({
    organization_id: organizationId, first_name: pick(FIRST, t * 5 + index + 3), last_name: pick(LAST, t * 3 + index), employee_id: `EMP-${String(t + 1).padStart(3, "0")}`,
    primary_subject: pick(SUBJECTS, t), email: alias(`${school.key}-teacher${t + 1}`), phone: phone(1000 + index * 50 + t), status: "active",
  })));

  const classes = await insert("school_classes", school.classes.map(([name, section], c) => ({ organization_id: organizationId, name, section, class_teacher_id: teachers[c % teachers.length].id, room_number: `Room ${101 + c}` })));

  const studentRows = [];
  school.classes.forEach(([, , size], c) => {
    for (let s = 0; s < size; s += 1) {
      const n = c * 100 + s;
      studentRows.push({ organization_id: organizationId, first_name: pick(FIRST, n * 7 + index), last_name: pick(LAST, n * 3 + index * 2 + c), roll_number: `${c + 1}${String(s + 1).padStart(2, "0")}`, class_id: classes[c].id, parent_phone: phone(20000 + index * 1000 + n), status: "active" });
    }
  });
  const students = await insert("school_students", studentRows);

  const fees = await insert("school_fee_structures", [
    { organization_id: organizationId, name: "Tuition Fee – Term 1", amount: 18000, frequency: "quarterly" },
    { organization_id: organizationId, name: "Transport Fee – October", amount: 2500, frequency: "monthly" },
    { organization_id: organizationId, name: "Annual Charges 2026-27", amount: 6000, frequency: "yearly" },
  ]);
  // Term 1 tuition is due for the first two classes.
  const dueStudents = students.filter((student) => student.class_id === classes[0].id || student.class_id === classes[1]?.id);
  await insert("school_student_fees", dueStudents.map((student) => ({ organization_id: organizationId, student_id: student.id, fee_structure_id: fees[0].id, due_date: daysAgo(-8), amount_due: 18000, amount_paid: 0, status: "pending" })));

  // Ten school days of attendance history for the first class.
  const attendance = [];
  for (let d = 1; d <= 14; d += 1) {
    const date = new Date(Date.now() - d * 86400000);
    if (date.getDay() === 0) continue;
    for (const student of students.filter((row) => row.class_id === classes[0].id)) {
      const roll = (student.roll_number.charCodeAt(2) + d) % 17;
      attendance.push({ organization_id: organizationId, student_id: student.id, class_id: classes[0].id, date: date.toISOString().slice(0, 10), status: roll === 0 ? "absent" : roll === 1 ? "late" : "present" });
    }
  }
  await insert("school_attendance", attendance);

  await insert("school_communications", [
    { organization_id: organizationId, type: "notice", title: "Gandhi Jayanti holiday on 2 October", message: "School will remain closed on Thursday, 2 October for Gandhi Jayanti.", audience: "all", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  ]);

  return { ...school, email, organizationId, classes: classes.map(({ id, name, section }) => ({ id, name, section })), teacherIds: teachers.map((teacher) => teacher.id), studentCount: students.length, studentIds: students.map((student) => student.id) };
}

const seeded = [];
for (const [index, school] of SCHOOLS.entries()) {
  const result = await seedSchool(school, index);
  seeded.push(result);
  console.log(`Seeded ${school.name}: ${result.studentCount} students, principal ${result.email}`);
}
writeJson("seed.json", seeded);

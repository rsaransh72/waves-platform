-- Website content for School ERP describing what the product actually does today.
-- Editable afterwards in Admin → Products → School ERP. Pricing is left to the
-- business to enter; until then the site shows "Pricing on request".

UPDATE public.products SET
  subtitle = 'Students, attendance, exams, fees and staff for your school in one secure system.',
  description = 'School ERP gives your office, teachers and management one place to run daily school operations, with each person seeing only what their role needs.',
  category = 'Education',
  target_audience = '["Schools", "School administrators", "Teachers", "Office staff"]'::jsonb,
  features = '[
    {"title": "Students and classes", "desc": "Admit students into classes and sections with roll numbers and a parent phone number. Students who leave are marked inactive and their records are kept."},
    {"title": "Daily attendance", "desc": "Teachers mark each class present, late or absent on one screen. The dashboard shows today''s attendance for the whole school."},
    {"title": "Exams and grades", "desc": "Schedule exams for a class and record subject-wise marks out of any maximum, with remarks for each student."},
    {"title": "Fee collection and receipts", "desc": "Set fee structures, raise fees for each student and record full or part payments by cash, UPI, cheque, NEFT or card. Every payment gets a numbered receipt with the amount in words, ready to print."},
    {"title": "Staff roles and access", "desc": "Invite administrators, teachers and office staff by email. Teachers never see fees, and only administrators change settings or manage users."},
    {"title": "Timetable", "desc": "Build each class''s weekly timetable with subject, teacher, time and room."},
    {"title": "Library", "desc": "Keep a catalogue of books and available copies, issue books to students, see what is overdue and mark returns."},
    {"title": "Transport", "desc": "Record bus routes, vehicles and drivers, with stops and pickup and drop times."},
    {"title": "Notices", "desc": "Post notices and announcements for staff and students inside the system."}
  ]'::jsonb,
  use_cases = '[
    {"title": "School office", "desc": "Admissions, fee collection and receipts handled by office staff, with every payment recorded against the student and numbered."},
    {"title": "Teachers", "desc": "Attendance and marks entered by teachers for their classes, without access to fee information."},
    {"title": "Principal and management", "desc": "A live view of students, staff, classes and today''s attendance on one dashboard, and full control of who has access."}
  ]'::jsonb,
  faqs = '[
    {"question": "How do we get started?", "answer": "Request a demo. After the call, our team creates your school''s account and your administrator receives an invitation by email. Your administrator then invites teachers and office staff from Users & Access."},
    {"question": "Who can see fee information?", "answer": "Only administrators and office staff. Teachers can mark attendance and enter marks but cannot see fees."},
    {"question": "Is our data kept separate from other schools?", "answer": "Yes. Each school''s records are separated in the database, so no other school can see them."},
    {"question": "Can you help us bring in our existing records?", "answer": "Yes. Tell us what you have today, for example a spreadsheet of students and classes, and we will agree how to bring it in during setup."}
  ]'::jsonb,
  seo_title = 'School ERP: students, attendance, exams and fees',
  seo_description = 'School management software for students, attendance, exams, fee receipts, timetable, library and transport, with role-based access for staff.',
  updated_at = now()
WHERE slug = 'school-erp';

SELECT slug, jsonb_array_length(features) AS features, jsonb_array_length(faqs) AS faqs, jsonb_array_length(pricing) AS plans
FROM public.products WHERE slug = 'school-erp';

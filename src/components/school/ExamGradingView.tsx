"use client";

import { useState } from "react";
import { 
  Search, 
  Edit2, 
  X,
  FileText,
  Save,
  CheckCircle2,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { describeError } from "@/lib/error-message";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function ExamGradingView({ examId, students, initialResults, classSubjects = [] }: { examId: string, students: any[], initialResults: any[], classSubjects?: string[] }) {
  const router = useRouter();
  const [results, setResults] = useState<any[]>(initialResults);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  // We'll manage an array of subjects in the form
  const [studentMarks, setStudentMarks] = useState<Array<{id?: string, subject: string, marks_obtained: number, max_marks: number, remarks: string}>>([]);

  const supabase = createClient();

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.roll_number && s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openGradingDrawer = (student: any) => {
    setSelectedStudent(student);
    // Find existing results for this student
    const existing = results.filter(r => r.student_id === student.id);
    
    if (existing.length > 0) {
      setStudentMarks(existing.map(e => ({
        id: e.id,
        subject: e.subject,
        marks_obtained: e.marks_obtained,
        max_marks: e.max_marks,
        remarks: e.remarks || ""
      })));
    } else {
      // Start from the class's subjects (set on the Classes page), or one blank row.
      const subjects = classSubjects.length ? classSubjects : [""];
      setStudentMarks(subjects.map((subject) => ({ subject, marks_obtained: 0, max_marks: 100, remarks: "" })));
    }
    
    setIsDrawerOpen(true);
  };

  const handleAddSubject = () => {
    setStudentMarks([...studentMarks, { subject: "", marks_obtained: 0, max_marks: 100, remarks: "" }]);
  };

  const handleRemoveSubject = (index: number) => {
    setStudentMarks(studentMarks.filter((_, i) => i !== index));
  };

  const handleMarkChange = (index: number, field: string, value: any) => {
    const newMarks = [...studentMarks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    setStudentMarks(newMarks);
  };

  const handleSaveGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    const marks = studentMarks
      .map((mark) => ({ ...mark, subject: mark.subject.trim() }))
      .filter((mark) => mark.subject !== "");

    const seen = new Set<string>();
    for (const mark of marks) {
      const key = mark.subject.toLowerCase();
      if (seen.has(key)) return toast.error(`"${mark.subject}" is listed more than once.`);
      seen.add(key);
      if (!Number.isFinite(mark.max_marks) || mark.max_marks <= 0) return toast.error(`Enter the maximum marks for ${mark.subject}.`);
      if (!Number.isFinite(mark.marks_obtained) || mark.marks_obtained < 0 || mark.marks_obtained > mark.max_marks) {
        return toast.error(`Marks for ${mark.subject} must be between 0 and ${mark.max_marks}.`);
      }
    }

    setIsSubmitting(true);
    try {
      // Save first, then remove dropped subjects, so a failed save never loses existing grades.
      let saved: any[] = [];
      if (marks.length > 0) {
        const { data, error } = await supabase
          .from("school_exam_results")
          .upsert(marks.map((mark) => ({
            exam_id: examId,
            student_id: selectedStudent.id,
            subject: mark.subject,
            marks_obtained: mark.marks_obtained,
            max_marks: mark.max_marks,
            remarks: mark.remarks || null,
          })), { onConflict: "exam_id,student_id,subject" })
          .select();
        if (error) throw error;
        saved = data ?? [];
      }

      const keptSubjects = new Set(marks.map((mark) => mark.subject));
      const removedIds = results
        .filter((result) => result.student_id === selectedStudent.id && !keptSubjects.has(result.subject))
        .map((result) => result.id);
      if (removedIds.length > 0) {
        const { error } = await supabase.from("school_exam_results").delete().in("id", removedIds);
        if (error) throw error;
      }

      setResults([...results.filter((result) => result.student_id !== selectedStudent.id), ...saved]);
      toast.success(`Grades saved for ${selectedStudent.first_name} ${selectedStudent.last_name}.`);
      setIsDrawerOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(`Could not save grades: ${describeError(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f5] border-b border-[#e5e5e5]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider w-[100px]">Roll No</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Student Name</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-center">Subjects Graded</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-center">Average Score</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#555555] text-[14px]">
                    No students found in this class.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentResults = results.filter(r => r.student_id === student.id);
                  const subjectsCount = studentResults.length;
                  
                  let average = 0;
                  if (subjectsCount > 0) {
                    const totalPercentage = studentResults.reduce((acc, curr) => acc + ((curr.marks_obtained / curr.max_marks) * 100), 0);
                    average = totalPercentage / subjectsCount;
                  }

                  return (
                    <tr key={student.id} className="hover:bg-[#fafafa] transition-colors group">
                      <td className="py-3 px-4 text-[14px] text-[#555555]">
                        {student.roll_number || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#111111] text-[14px]">
                          {student.first_name} {student.last_name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {subjectsCount > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#f0f9ff] text-[#0284c7] border border-[#e0f2fe]">
                            {subjectsCount} Subjects
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#888888] italic">Not graded</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {subjectsCount > 0 ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={
                              `text-[14px] font-bold ` +
                              (average >= 80 ? 'text-[#15803d]' : average >= 50 ? 'text-[#b45309]' : 'text-[#b91c1c]')
                            }>
                              {average.toFixed(1)}%
                            </span>
                            {average >= 80 && <Award className="w-4 h-4 text-[#eab308]" />}
                          </div>
                        ) : (
                          <span className="text-[14px] text-[#cccccc]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => openGradingDrawer(student)}
                          className={
                            `h-8 px-3 text-[12px] font-medium rounded transition-colors shadow-sm inline-flex items-center gap-1.5 ` + 
                            (subjectsCount > 0 
                              ? 'bg-white border border-[#cccccc] text-[#333333] hover:bg-[#f4f4f5]' 
                              : 'bg-[#0066cc] text-white hover:bg-[#0055bb]')
                          }
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          {subjectsCount > 0 ? 'Edit Grades' : 'Enter Grades'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Drawer */}
      {isDrawerOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5] bg-[#fafafa]">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111111]">Report Card</h3>
                <p className="text-[13px] text-[#555555] mt-0.5">{selectedStudent.first_name} {selectedStudent.last_name} (Roll: {selectedStudent.roll_number || 'N/A'})</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1.5 rounded-md hover:bg-[#e5e5e5] transition-colors border border-transparent hover:border-[#cccccc]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveGrades} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[14px] font-semibold text-[#333333]">Subject Marks</h4>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="text-[12px] font-medium text-[#0066cc] hover:text-[#0055bb] flex items-center gap-1"
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="space-y-4">
                  <datalist id="exam-subject-options">
                    {classSubjects.map((subject) => <option key={subject} value={subject} />)}
                  </datalist>
                  {studentMarks.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-[#e5e5e5] rounded-lg">
                      <p className="text-[13px] text-[#888888]">No subjects added yet.</p>
                      <button type="button" onClick={handleAddSubject} className="mt-2 text-[#0066cc] text-[13px] font-medium">Add first subject</button>
                    </div>
                  ) : (
                    studentMarks.map((mark, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-[#f9f9fa] rounded-lg border border-[#e5e5e5] relative group">
                        
                        <div className="flex-1">
                          <label className="block text-[11px] font-semibold text-[#888888] uppercase mb-1">Subject</label>
                          <input
                            type="text"
                            required
                            value={mark.subject}
                            onChange={e => handleMarkChange(index, 'subject', e.target.value)}
                            list="exam-subject-options"
                            placeholder="e.g. Mathematics"
                            className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
                          />
                        </div>
                        
                        <div className="w-full sm:w-24">
                          <label className="block text-[11px] font-semibold text-[#888888] uppercase mb-1">Obtained</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.1"
                            max={mark.max_marks}
                            value={mark.marks_obtained}
                            onChange={e => handleMarkChange(index, 'marks_obtained', parseFloat(e.target.value))}
                            className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
                          />
                        </div>

                        <div className="w-full sm:w-24">
                          <label className="block text-[11px] font-semibold text-[#888888] uppercase mb-1">Out Of</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="1000"
                            value={mark.max_marks}
                            onChange={e => handleMarkChange(index, 'max_marks', parseFloat(e.target.value))}
                            className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-[#f4f4f5] text-[14px] focus:outline-none"
                          />
                        </div>

                        <button 
                          type="button" 
                          onClick={() => handleRemoveSubject(index)}
                          className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-[#cccccc] rounded-full flex items-center justify-center text-[#888888] hover:text-[#e42525] hover:border-[#e42525] opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#111111] hover:bg-[#333333] text-white text-[14px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving Grades...' : 'Save Report Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

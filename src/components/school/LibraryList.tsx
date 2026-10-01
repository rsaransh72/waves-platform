"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  X,
  Book,
  UserCheck,
  MoreVertical,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function LibraryList({ initialBooks, students }: { initialBooks: any[], students: any[] }) {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState<any[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
  
  const [selectedBook, setSelectedBook] = useState<any>(null);
  
  const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", quantity: 1 });
  const [issueForm, setIssueForm] = useState({ student_id: "", due_date: "" });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter(b => 
      b.title.toLowerCase().includes(query) ||
      (b.author && b.author.toLowerCase().includes(query))
    );
    setFilteredBooks(filtered);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('school_library_books')
        .insert([{
          title: bookForm.title,
          author: bookForm.author,
          isbn: bookForm.isbn,
          quantity: bookForm.quantity,
          available: bookForm.quantity
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newData = [data, ...books];
        setBooks(newData);
        setFilteredBooks(newData);
        setIsBookDrawerOpen(false);
        setBookForm({ title: "", author: "", isbn: "", quantity: 1 });
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Failed to add book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create issue record
      const { error: issueError } = await supabase
        .from('school_library_issues')
        .insert([{
          book_id: selectedBook.id,
          student_id: issueForm.student_id,
          due_date: issueForm.due_date,
          status: 'issued'
        }]);

      if (issueError) throw issueError;

      // Decrement available count
      const newAvailable = selectedBook.available - 1;
      const { error: updateError } = await supabase
        .from('school_library_books')
        .update({ available: newAvailable })
        .eq('id', selectedBook.id);

      if (updateError) throw updateError;

      const updatedBooks = books.map(b => b.id === selectedBook.id ? { ...b, available: newAvailable } : b);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      
      setIsIssueDrawerOpen(false);
      setIssueForm({ student_id: "", due_date: "" });
      alert("Book Issued Successfully!");
    } catch (err) {
      console.error("Error issuing book:", err);
      alert("Failed to issue book.");
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
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
          
          <button
            onClick={() => setIsBookDrawerOpen(true)}
            className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f5] border-b border-[#e5e5e5]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Book Title</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">Author</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider">ISBN</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-center">Available</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[#555555] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#555555] text-[14px]">
                    No books found.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-[#fafafa] transition-colors group">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#111111] text-[14px] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#888888]" /> {book.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#555555]">
                      {book.author || '-'}
                    </td>
                    <td className="py-3 px-4 text-[13px] text-[#888888]">
                      {book.isbn || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={
                        `inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium ` +
                        (book.available > 0 ? 'bg-[#f0fdf4] text-[#15803d]' : 'bg-[#fef2f2] text-[#b91c1c]')
                      }>
                        {book.available} / {book.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {book.available > 0 ? (
                        <button 
                          onClick={() => { setSelectedBook(book); setIsIssueDrawerOpen(true); }}
                          className="h-8 px-3 bg-white border border-[#0066cc] hover:bg-[#eff6ff] text-[#0066cc] text-[12px] font-medium rounded transition-colors shadow-sm inline-flex items-center gap-1.5"
                        >
                          Issue Book
                        </button>
                      ) : (
                        <span className="text-[12px] text-[#888888] italic">Checked Out</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Drawer */}
      {isBookDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsBookDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Add Library Book</h3>
              <button onClick={() => setIsBookDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddBook} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={e => setBookForm({...bookForm, title: e.target.value})}
                    placeholder="e.g. The Great Gatsby"
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Author</label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={e => setBookForm({...bookForm, author: e.target.value})}
                    placeholder="e.g. F. Scott Fitzgerald"
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">ISBN Number</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={e => setBookForm({...bookForm, isbn: e.target.value})}
                    placeholder="e.g. 978-3-16-148410-0"
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Total Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={bookForm.quantity}
                    onChange={e => setBookForm({...bookForm, quantity: parseInt(e.target.value)})}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsBookDrawerOpen(false)} className="flex-1 h-10 border rounded-md">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 h-10 bg-[#0066cc] text-white rounded-md">{isSubmitting ? 'Saving...' : 'Add Book'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Drawer */}
      {isIssueDrawerOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsIssueDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5] bg-[#0066cc]">
              <h3 className="text-[18px] font-semibold text-white">Issue Book</h3>
              <button onClick={() => setIsIssueDrawerOpen(false)} className="text-white/80 hover:text-white p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleIssueBook} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="bg-[#f0f9ff] p-4 rounded-lg border border-[#bae6fd]">
                  <div className="text-[12px] font-medium text-[#0284c7] uppercase tracking-wider mb-1">Book Details</div>
                  <div className="font-bold text-[#0f172a] text-[16px]">{selectedBook.title}</div>
                  <div className="text-[14px] text-[#475569]">{selectedBook.author}</div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Select Student *</label>
                  <select
                    required
                    value={issueForm.student_id}
                    onChange={e => setIssueForm({...issueForm, student_id: e.target.value})}
                    className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
                  >
                    <option value="">Select Student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.roll_number})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Return Due Date *</label>
                  <input
                    type="date"
                    required
                    value={issueForm.due_date}
                    onChange={e => setIssueForm({...issueForm, due_date: e.target.value})}
                    className="w-full h-10 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none"
                  />
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-bold rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isSubmitting ? 'Processing...' : 'Confirm Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

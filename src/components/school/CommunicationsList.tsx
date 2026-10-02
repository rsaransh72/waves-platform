"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  X,
  Bell,
  Mail,
  MessageSquare,
  Users
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { describeError } from "@/lib/error-message";
import { useCanManage } from "@/components/school/SchoolSessionContext";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/india";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function CommunicationsList({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const canManage = useCanManage("communications");
  const [messages, setMessages] = useState<any[]>(initialData);
  const [filteredMessages, setFilteredMessages] = useState<any[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "notice",
    audience: "all",
    title: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = messages.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query)
    );
    setFilteredMessages(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('school_communications')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newData = [data, ...messages];
        setMessages(newData);
        setFilteredMessages(newData);
        setIsDrawerOpen(false);
        setFormData({ type: "notice", audience: "all", title: "", message: "" });
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating communication:", error);
      toast.error(`Failed to send message: ${describeError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'sms': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-amber-600" />;
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
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-[#cccccc] bg-white text-[13px] text-[#111111] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-shadow placeholder:text-[#888888]"
            />
          </div>
          
          {canManage && <button
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 px-4 bg-[#0066cc] hover:bg-[#0055bb] text-white text-[13px] font-medium rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>}
        </div>

        {/* List */}
        <div className="overflow-x-auto min-h-[400px]">
          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-[#555555] text-[14px]">
              No communications found.
            </div>
          ) : (
            <div className="divide-y divide-[#e5e5e5]">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-[#fafafa] transition-colors flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f4f4f5] flex items-center justify-center shrink-0">
                    {getIcon(msg.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#111111] text-[15px]">{msg.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f4f4f5] text-[#555555] border border-[#e5e5e5]">
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#555555] mb-3 leading-relaxed max-w-3xl">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-4 text-[12px] text-[#888888]">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Audience: <span className="capitalize">{msg.audience}</span></span>
                      <span>•</span>
                      <span>{formatDateTime(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <h3 className="text-[18px] font-semibold text-[#111111]">Send Message</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-[#888888] hover:text-[#111111] p-1 rounded-md hover:bg-[#f4f4f5] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Message Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  >
                    <option value="notice">Notice Board Alert 📢</option>
                    <option value="sms">SMS Text Message 📱</option>
                    <option value="email">Email Blast ✉️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Target Audience *</label>
                  <select
                    required
                    value={formData.audience}
                    onChange={e => setFormData({...formData, audience: e.target.value})}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  >
                    <option value="all">Everyone (Students, Parents, Staff)</option>
                    <option value="parents">Parents Only</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teaching Staff Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Subject / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. School will remain closed tomorrow due to heavy rain" minLength={3} maxLength={150}
                    className="w-full h-9 px-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#333333] mb-1.5">Message Body *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Type your message here..." minLength={3} maxLength={2000}
                    className="w-full p-3 rounded-md border border-[#cccccc] bg-white text-[14px] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] outline-none transition-shadow resize-none"
                  />
                </div>
              </div>
              
              <div className="mt-auto p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 h-10 border rounded-md font-medium text-[14px]">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 h-10 bg-[#0066cc] text-white rounded-md font-medium text-[14px] flex items-center justify-center gap-2">
                    {isSubmitting ? 'Sending...' : 'Send Now'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

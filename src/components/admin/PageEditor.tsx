"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { formatAdminDateTime } from "@/lib/admin-format";
import { ArrowLeft, Save, Globe, Lock, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { clsx } from "clsx";

interface PageEditorProps {
  initialData: any;
  isNew?: boolean;
}

export function PageEditor({ initialData, isNew = false }: PageEditorProps) {
  const { updatePage, addPage } = useAdminStore();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    slug: initialData.slug || "",
    status: initialData.status || "draft",
    visibility: initialData.visibility || "public",
    seo_title: initialData.seo_title || "",
    seo_description: initialData.seo_description || "",
    blocks: initialData.blocks || []
  });

  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (newStatus?: string) => {
    setIsProcessing(true);
    const finalStatus = newStatus || formData.status;
    const finalData = { ...formData, status: finalStatus };
    
    try {
      const supabase = createClient();
      
      if (isNew) {
        const { data, error } = await supabase.from("pages").insert([finalData]).select().single();
        if (error) throw error;
        addPage(data);
        toast.success("Page created!");
        router.push(`/admin/pages/${data.slug}`);
      } else {
        updatePage(initialData.id, finalData); // optimistic
        const { error } = await supabase.from("pages").update(finalData).eq("id", initialData.id);
        if (error) throw error;
        toast.success("Page saved!");
        setFormData(finalData); // update local state with final status
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{formData.title || "Untitled Page"}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", 
                formData.status === 'published' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-600 bg-slate-100 border border-slate-200'
              )}>
                {formData.status === 'published' ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                {formData.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">/{formData.slug}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {formData.status === 'published' ? 'Update Live Page' : 'Publish Page'}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('content')}
              className={clsx("px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'content' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
            >
              Content Builder
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={clsx("flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'settings' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
            >
              <Settings className="w-4 h-4" /> SEO & Settings
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[600px] flex flex-col">
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Page Title..."
                className="text-4xl font-bold text-slate-900 border-none outline-none focus:ring-0 p-0 placeholder-slate-300 w-full mb-8"
              />
              
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                 <p className="font-bold mb-2">JSON Block Editor</p>
                 <p className="text-sm text-center max-w-sm">
                   The rich-text block editor is currently in read-only mode for this advanced prototype. 
                 </p>
                 <div className="mt-6 w-full max-w-lg bg-slate-800 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto text-left shadow-inner">
                    <pre>{JSON.stringify(formData.blocks, null, 2)}</pre>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-slate-200 border-r-0 px-3 py-2 rounded-l-lg text-slate-500 text-sm">/</span>
                    <input 
                      type="text" 
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="flex-1 w-full rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Unique URL path for this page.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Visibility</label>
                  <select 
                    name="visibility" 
                    value={formData.visibility} 
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="public">Public (Everyone)</option>
                    <option value="private">Private (Logged in users only)</option>
                    <option value="password">Password Protected</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-slate-900 mb-4">Search Engine Optimization (SEO)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">SEO Title</label>
                    <input 
                      type="text" 
                      name="seo_title"
                      value={formData.seo_title}
                      onChange={handleChange}
                      placeholder={formData.title}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">50-60 characters recommended.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
                    <textarea 
                      name="seo_description"
                      value={formData.seo_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Sidebar - Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Page Details</h3>
            
            {!isNew && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Created</label>
                  <div className="text-sm text-slate-900 mt-1">
                    {formatAdminDateTime(initialData.created_at)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Last Updated</label>
                  <div className="text-sm text-slate-900 mt-1">
                    {formatAdminDateTime(initialData.updated_at)}
                  </div>
                </div>
                {initialData.published_at && (
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">First Published</label>
                    <div className="text-sm text-slate-900 mt-1">
                      {formatAdminDateTime(initialData.published_at)}
                    </div>
                  </div>
                )}
              </>
            )}
            {isNew && (
               <div className="text-sm text-slate-500">Unsaved Draft</div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

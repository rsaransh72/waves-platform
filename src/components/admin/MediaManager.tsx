import { useState } from "react";
import { Loader2, Copy, Trash2, Image as ImageIcon, Save, ExternalLink } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { formatAdminDate } from "@/lib/admin-format";

interface MediaManagerProps {
  initialData: any;
  onClose: () => void;
}

export function MediaManager({ initialData, onClose }: MediaManagerProps) {
  const { updateMedia, removeMedia } = useAdminStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [altText, setAltText] = useState(initialData?.alt_text || "");

  if (!initialData) return null;

  const handleUpdate = async () => {
    setIsProcessing("update");
    try {
      const supabase = createClient();
      updateMedia(initialData.id, { alt_text: altText });
      
      const { error } = await supabase.from("media").update({ alt_text: altText }).eq("id", initialData.id);
      if (error) throw error;
      
      toast.success("Media details updated.");
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this file? This will break any links using this image.")) return;
    setIsProcessing("delete");
    try {
      const supabase = createClient();
      
      const { error } = await supabase.from("media").delete().eq("id", initialData.id);
      if (error) throw error;
      
      removeMedia(initialData.id);
      toast.success("File deleted successfully.");
      onClose();
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(initialData.url);
    toast.success("URL copied to clipboard.");
  };

  const isImage = initialData.file_type?.startsWith('image/');
  const formattedSize = (initialData.file_size / 1024).toFixed(2) + " KB";

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* File Preview Header */}
      <div className="bg-slate-100 border-b border-gray-200 flex items-center justify-center p-6 h-64 overflow-hidden relative">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initialData.url} alt={initialData.alt_text} className="max-h-full max-w-full object-contain drop-shadow-md rounded" />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <ImageIcon className="w-16 h-16 mb-2" />
            <span>No Preview Available</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* File Details */}
        <div>
          <h3 className="font-bold text-slate-900 truncate mb-1" title={initialData.filename}>
            {initialData.filename}
          </h3>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span>{formattedSize}</span>
            <span>•</span>
            <span className="uppercase">{initialData.file_type?.split('/')[1] || 'UNKNOWN'}</span>
            <span>•</span>
            <span>{formatAdminDate(initialData.created_at)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        
        {/* URL Box */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Public URL</label>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={initialData.url} 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
              title="Copy URL"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a 
              href={initialData.url} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* SEO Data */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">SEO & Accessibility</label>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Alt Text</label>
            <textarea
              className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px]"
              placeholder="Describe this image for screen readers and search engines..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          <button 
            onClick={handleUpdate}
            disabled={isProcessing !== null || altText === initialData.alt_text}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isProcessing === "update" ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm">Delete File</h3>
              <p className="text-xs text-red-700 mt-1 mb-3">Permanently remove this file from storage. It will break anywhere it is currently embedded.</p>
              <button 
                onClick={handleDelete}
                disabled={isProcessing !== null}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing === "delete" && <Loader2 className="w-3.5 h-3.5 animate-spin"/>}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

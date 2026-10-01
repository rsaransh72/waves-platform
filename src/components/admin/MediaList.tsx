"use client";

import { useEffect, useState, useMemo } from "react";
import { Image as ImageIcon, Upload, Search, File, Ellipsis } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { Drawer } from "./Drawer";
import { MediaManager } from "./MediaManager";

export function MediaList({ initialMedia }: { initialMedia: any[] }) {
  const { media, setMedia } = useAdminStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    setMedia(initialMedia);
  }, [initialMedia, setMedia]);

  const mediaData = useMemo(() => {
    let data = Object.values(media.data);
    if (searchQuery) {
      data = data.filter(item => 
        item.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [media.data, searchQuery]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media Library</h1>
          <p className="text-sm font-medium text-slate-500">Manage your uploaded files, images, and assets.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed">
          <Upload className="w-4 h-4" />
          Upload Files (Coming Soon)
        </button>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50 shrink-0">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {mediaData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-medium text-slate-600">No media found</p>
              <p className="text-sm">Upload files or try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mediaData.map((item) => {
                const isImage = item.file_type?.startsWith('image/');
                return (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedFile(item);
                      setIsDrawerOpen(true);
                    }}
                    className="group relative aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex flex-col"
                  >
                    <button
                      type="button"
                      title={`File options for ${item.filename}`}
                      aria-label={`File options for ${item.filename}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedFile(item);
                        setIsDrawerOpen(true);
                      }}
                      className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center border border-slate-200 bg-white/95 text-slate-700 shadow-sm hover:bg-white"
                    >
                      <Ellipsis className="h-4 w-4" />
                    </button>
                    <div className="flex-1 flex items-center justify-center p-2 h-[80%]">
                      {isImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={item.url} 
                          alt={item.alt_text} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <File className="w-10 h-10 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 p-2 text-xs h-[20%]">
                      <span className="font-medium text-slate-700 block truncate">{item.filename}</span>
                      <span className="text-slate-400">{(item.file_size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="File Details"
      >
        <MediaManager 
          initialData={selectedFile} 
          onClose={() => setIsDrawerOpen(false)} 
        />
      </Drawer>
    </div>
  );
}

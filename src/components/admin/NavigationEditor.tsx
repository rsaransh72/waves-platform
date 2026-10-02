"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2, GripVertical, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { normalizePublicMenuPath } from "@/lib/public-menu";

export function NavigationEditor({ initialMenu, validPaths }: { initialMenu: any; validPaths: string[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState(initialMenu?.items || []);

  const handleAddItem = () => {
    setItems([...items, { label: "", href: "", subItems: [] }]);
  };

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // A link to a page that does not exist yet (or has no content) is saved but hidden on
  // the website until the page is ready, so the menu can be prepared in advance.
  const isLive = (href: unknown) => {
    const path = normalizePublicMenuPath(href);
    return Boolean(path && validPaths.includes(path));
  };

  const handleSave = async () => {
    const unlabeled = items.find((item: { label?: unknown }) => typeof item.label !== "string" || !item.label.trim());
    if (unlabeled) {
      toast.error("Every menu link needs a label.");
      return;
    }
    const badPath = items.find((item: { href?: unknown }) => !normalizePublicMenuPath(item.href));
    if (badPath) {
      toast.error(`"${badPath.label}" needs a path that starts with /, e.g. /contact.`);
      return;
    }
    const hidden = items.filter((item: { href?: unknown }) => !isLive(item.href)).map((item: { label: string }) => item.label);

    setIsSaving(true);
    try {
      const supabase = createClient();
      if (initialMenu) {
        const { error } = await supabase.from("menus").update({ items }).eq("id", initialMenu.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menus").insert([{ name: "Main Navbar", items }]);
        if (error) throw error;
      }
      toast.success(hidden.length ? `Website menu saved. Hidden until their pages have content: ${hidden.join(", ")}.` : "Website menu saved.");
      router.refresh();
    } catch (err: any) {
      toast.error(`Could not save the menu: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-slate-800">Main Navbar Links</h3>
        <button 
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 rounded bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Link
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-slate-50 relative group items-center shadow-sm">
            <div className="text-slate-400 cursor-grab">
              <GripVertical className="h-5 w-5" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Label</label>
                <input 
                  type="text" 
                  value={item.label}
                  required
                  onChange={(e) => handleUpdateItem(idx, "label", e.target.value)}
                  placeholder="e.g. Products"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">URL Path</label>
                <input 
                  type="text" 
                  value={item.href}
                  onChange={(e) => handleUpdateItem(idx, "href", e.target.value)}
                  required
                  list="public-navigation-routes"
                  placeholder="e.g. /school-erp"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                />
                {item.href && !isLive(item.href) && (
                  <p className="mt-1 text-xs font-medium text-amber-700">Not shown on the website: this page does not exist or has no content yet.</p>
                )}
              </div>
            </div>

            <button onClick={() => handleRemoveItem(idx)} className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        <datalist id="public-navigation-routes">
          {validPaths.map((path) => <option key={path} value={path} />)}
        </datalist>

        {items.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-slate-500 font-medium">No links added to the navbar yet.</p>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Navigation
        </button>
      </div>
    </div>
  );
}

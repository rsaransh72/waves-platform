import { useState, useEffect } from "react";
import { X, Save, Shield, User, Loader2 } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase-browser";
import { v4 as uuidv4 } from "uuid";

interface UserEditorProps {
  initialData: any;
  isNew: boolean;
  onClose: () => void;
}

export function UserEditor({ initialData, isNew, onClose }: UserEditorProps) {
  const { addTeamMember, updateTeamMember } = useAdminStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (initialData && !isNew) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        role: "user",
        status: "active",
      });
    }
  }, [initialData, isNew]);

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      setIsSaving(true);
      const supabase = createClient();
      let recordId = formData.id;

      if (isNew) {
        recordId = uuidv4();
        const optimisticUser = { ...formData, id: recordId, created_at: new Date().toISOString() };
        addTeamMember(optimisticUser);
        toast.success("User added optimistically!");
        onClose();

        const { error } = await supabase.from("team_members").insert([optimisticUser]);
        if (error) throw error;
        
        // TRIGGER AUTOMATION Lifecycle
        const { triggerAutomationEvent } = await import('@/app/actions/automations');
        await triggerAutomationEvent('USER_CREATED', optimisticUser);

      } else {
        const previousData = initialData;
        updateTeamMember(formData.id, formData);
        toast.success("Changes saved optimistically!");
        onClose();

        const { error } = await supabase.from("team_members").update({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        }).eq("id", formData.id);
        
        if (error) {
          updateTeamMember(formData.id, previousData);
          throw error;
        }
      }
    } catch (err: any) {
      toast.error(`Error saving user: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          {isNew ? "Invite New User" : "Edit User"}
        </h2>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
            <select
              value={formData.role || "user"}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="support">Support</option>
              <option value="user">User</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Controls what the user can see and do in the portal.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
            <div className="flex gap-4">
              {['active', 'suspended', 'invited'].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status"
                    value={s}
                    checked={formData.status === s}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-6 bg-slate-50 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? "Invite User" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

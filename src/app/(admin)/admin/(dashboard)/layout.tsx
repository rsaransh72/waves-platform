import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { RealtimeProvider } from "@/components/admin/RealtimeProvider";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | Waves Platform",
  description: "Enterprise CMS & Admin Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <RealtimeProvider />
      <CommandPalette />
      <Toaster position="top-right" richColors />
      <Sidebar />
      <div className="flex flex-col md:pl-64 h-full">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 flex flex-col">
          <div className="w-full flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

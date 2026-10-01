import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-20"></div>
      </div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
        Loading Data...
      </p>
    </div>
  );
}

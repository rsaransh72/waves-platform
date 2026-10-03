// Shown the moment a school page link is clicked, while that page's data loads on the
// server. The sidebar and header stay in place; only the page area shows this.
export default function SchoolPageLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="flex flex-1 flex-col gap-6 animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-slate-200" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 p-4">
          <div className="h-9 w-64 max-w-[60%] rounded bg-slate-200" />
          <div className="h-9 w-32 rounded bg-slate-200" />
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
            <div className="h-4 w-10 rounded bg-slate-100" />
            <div className="h-4 flex-1 rounded bg-slate-100" />
            <div className="hidden h-4 w-24 rounded bg-slate-100 sm:block" />
            <div className="hidden h-4 w-20 rounded bg-slate-100 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

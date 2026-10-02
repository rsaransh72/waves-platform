// Shared building blocks for admin console pages: a full-width white sheet with a
// sticky title bar, label-left form rows, banners and badges. Server-safe (no hooks).
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Info, XCircle } from "lucide-react";

export const adminInput = "h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 disabled:bg-slate-50 disabled:text-slate-500";
export const adminTextarea = adminInput.replace("h-9", "min-h-[84px] py-2 leading-relaxed");
export const adminInvalid = "!border-red-500 focus:!ring-red-500/15";
export const adminHint = "mt-1.5 text-xs leading-relaxed text-slate-500";

const buttonBase = "inline-flex h-9 items-center justify-center gap-2 rounded px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
export const button = {
  primary: `${buttonBase} bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700`,
  secondary: `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`,
  danger: `${buttonBase} bg-red-600 font-semibold text-white shadow-sm hover:bg-red-700`,
  ghost: `${buttonBase} px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900`,
};

// Cancels the padding of the admin <main> so the page fills it edge to edge.
// Pages that are one big form put `pageSheet` on their <form> instead.
export const pageSheet = "-m-4 flex flex-1 flex-col bg-white md:-m-6";

export function PageSheet({ children }: { children: React.ReactNode }) {
  return <div className={pageSheet}>{children}</div>;
}

// Title bar that stays in view. Sticky offsets are measured inside <main>'s padding,
// hence the negative top.
export function PageHeader({ title, description, backHref, actions }: { title: React.ReactNode; description?: React.ReactNode; backHref?: string; actions?: React.ReactNode }) {
  return (
    <header className="sticky -top-4 z-20 flex min-h-[65px] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:-top-6 md:px-6">
      {backHref && (
        <Link href={backHref} aria-label="Back" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate !text-lg !leading-6 font-semibold text-slate-900">{title}</h1>
        {description && <p className="hidden truncate text-xs text-slate-500 sm:block">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

// One form row: label on the left from md up, on top below.
export function FormRow({ label, htmlFor, labelId, required, optional, wide, children }: { label: string; htmlFor?: string; labelId?: string; required?: boolean; optional?: boolean; wide?: boolean; children: React.ReactNode }) {
  const labelClass = "text-[13px] font-medium text-slate-600 md:pt-2 md:text-right";
  const content = (
    <>
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
      {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
    </>
  );
  return (
    <div className={`grid gap-1.5 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6 ${wide ? "min-[1700px]:col-span-2" : ""}`}>
      {htmlFor ? <label htmlFor={htmlFor} className={labelClass}>{content}</label> : <span id={labelId} className={labelClass}>{content}</span>}
      <div className={`min-w-0 ${wide ? "max-w-[760px] min-[1700px]:max-w-none" : "max-w-[520px]"}`}>{children}</div>
    </div>
  );
}

export function FormSection({ id, title, description, badge, columns = "min-[1700px]:grid-cols-2", children }: { id: string; title: string; description?: React.ReactNode; badge?: React.ReactNode; columns?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-b border-slate-200 py-8 last:border-b-0">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id={`${id}-title`} className="!text-[15px] font-semibold text-slate-900">{title}</h2>
        {badge}
        {description && <p className="w-full text-[13px] text-slate-500">{description}</p>}
      </div>
      <div className={`grid grid-cols-1 gap-x-12 gap-y-5 ${columns}`}>{children}</div>
    </section>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" /> {message}
    </p>
  );
}

const BANNER_TONES = {
  info: { className: "border-blue-200 bg-blue-50 text-blue-900", Icon: Info },
  warning: { className: "border-amber-200 bg-amber-50 text-amber-900", Icon: AlertCircle },
  error: { className: "border-red-200 bg-red-50 text-red-800", Icon: XCircle },
  success: { className: "border-emerald-200 bg-emerald-50 text-emerald-900", Icon: CheckCircle2 },
};

export function Banner({ tone = "info", title, children, role }: { tone?: keyof typeof BANNER_TONES; title?: React.ReactNode; children?: React.ReactNode; role?: "alert" | "status" }) {
  const { className, Icon } = BANNER_TONES[tone];
  return (
    <div role={role} className={`flex items-start gap-2.5 rounded border px-4 py-3 text-[13px] ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-1" : undefined}>{children}</div>}
      </div>
    </div>
  );
}

const BADGE_TONES = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/15",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
};
const DOT_TONES: Record<keyof typeof BADGE_TONES, string> = { green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500", blue: "bg-blue-500", slate: "bg-slate-400", violet: "bg-violet-500" };

export function Badge({ tone = "slate", dot, children }: { tone?: keyof typeof BADGE_TONES; dot?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${BADGE_TONES[tone]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[tone]}`} />}
      {children}
    </span>
  );
}

const AVATAR_COLORS = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-800", "bg-violet-100 text-violet-700", "bg-rose-100 text-rose-700", "bg-cyan-100 text-cyan-800"];

// Initials on a colour picked from the text, so a person keeps the same colour.
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const words = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  const initials = ((words[0]?.[0] ?? "?") + (words[1]?.[0] ?? "")).toUpperCase();
  const color = AVATAR_COLORS[[...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_COLORS.length];
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-xs"}`}>
      {initials}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Icon className="h-6 w-6" /></span>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      {children && <div className="mt-1 max-w-sm text-[13px] text-slate-500">{children}</div>}
    </div>
  );
}

// Table header cell and body cell classes, shared so every list looks the same.
// Headers stick under the title bar only from lg up: below that the table scrolls
// sideways in its own container, which would offset a sticky header.
export const th = "relative z-10 lg:sticky lg:top-[41px] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500";
export const td = "px-4 py-3 align-middle";

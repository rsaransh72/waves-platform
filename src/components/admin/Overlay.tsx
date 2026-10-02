"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { button } from "@/components/admin/ui";

// A modal built on <dialog>: the browser traps focus, closes it on Escape and makes
// the rest of the page inert.
export function Dialog({ open, onClose, title, description, children, footer, size = "md" }: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className={`m-auto w-[calc(100%-2rem)] rounded-lg bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-[1px] ${size === "sm" ? "max-w-md" : "max-w-lg"}`}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="!text-base font-semibold text-slate-900">{title}</h2>
              {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="-mr-1 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          {children && <div className="overflow-y-auto px-5 py-5">{children}</div>}
          {footer && <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, children, confirmLabel, tone = "danger", busy }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  tone?: "danger" | "primary";
  busy?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className={button.secondary}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={tone === "danger" ? button.danger : button.primary} autoFocus>{confirmLabel}</button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-slate-600">{children}</div>
    </Dialog>
  );
}

export type MenuItem = { label: string; icon?: React.ComponentType<{ className?: string }>; onSelect: () => void; danger?: boolean; disabled?: boolean } | "separator";

// "…" button with a small list of actions for one row.
export function RowMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    wrapper.current?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")?.focus();
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const moveFocus = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const options = Array.from(wrapper.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? []);
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length]?.focus();
  };

  return (
    <div ref={wrapper} className="relative inline-block text-left">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${open ? "bg-slate-100 text-slate-900" : ""}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div id={menuId} role="menu" onKeyDown={moveFocus} className="absolute right-0 z-30 mt-1 min-w-[200px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {items.map((item, index) => item === "separator" ? (
            <div key={`separator-${index}`} role="separator" className="my-1 border-t border-slate-100" />
          ) : (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => { setOpen(false); item.onSelect(); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${item.danger ? "text-red-600 hover:bg-red-50 focus:bg-red-50" : "text-slate-700 hover:bg-slate-50 focus:bg-slate-50"}`}
            >
              {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

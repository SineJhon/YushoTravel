"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Dialog"}
    >
      <button
        aria-label="Close"
        className="absolute inset-0 bg-forest-950/55 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={cn(
          "relative z-10 w-full overflow-hidden rounded-t-3xl bg-white shadow-pop sm:rounded-3xl animate-scale-in",
          maxWidth,
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-200/50 px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-9 items-center justify-center rounded-full text-ink-500 hover:bg-sand-100 hover:text-ink-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[78vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
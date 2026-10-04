import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 disabled:bg-sand-100 disabled:text-ink-400";

export function Input({ className, invalid, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        controlBase,
        invalid ? "border-red-400 bg-red-50/40" : "border-ink-200",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, invalid, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        controlBase,
        "min-h-28 resize-y",
        invalid ? "border-red-400 bg-red-50/40" : "border-ink-200",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, invalid, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      className={cn(
        controlBase,
        "appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23525c56%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[position:right_0.9rem_center] bg-no-repeat pr-10",
        invalid ? "border-red-400 bg-red-50/40" : "border-ink-200",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children, htmlFor, optional }: { children: ReactNode; htmlFor?: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink-700">
      {children}
      {optional && <span className="font-normal text-ink-400">(optional)</span>}
    </label>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={htmlFor} optional={optional}>
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-[13px] font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}
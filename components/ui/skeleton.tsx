import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-card border border-ink-200/40 bg-white p-4">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-card border border-dashed border-ink-200 bg-sand-50 px-6 py-16 text-center", className)}>
      {icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      {text && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
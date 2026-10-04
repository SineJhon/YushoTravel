import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/constants";

export const toneClasses: Record<Tone, string> = {
  green: "bg-forest-100 text-forest-800",
  teal: "bg-teal-100 text-teal-800",
  gold: "bg-gold-100 text-gold-900",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  slate: "bg-ink-200/70 text-ink-700",
  blue: "bg-sky-100 text-sky-800",
};

export function Badge({
  tone = "slate",
  children,
  className,
  dot = false,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
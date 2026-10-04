import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "dark" | "danger" | "soft" | "light";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-55 disabled:pointer-events-none whitespace-nowrap select-none";

export const variants: Record<Variant, string> = {
  primary: "bg-forest-800 text-sand-50 hover:bg-forest-900 shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
  gold: "bg-gold-400 text-forest-950 hover:bg-gold-300 shadow-glow-gold hover:-translate-y-0.5",
  outline: "border border-forest-800/25 bg-transparent text-forest-900 hover:border-forest-800/60 hover:bg-forest-800/5",
  ghost: "text-forest-800 hover:bg-forest-800/8",
  dark: "bg-ink-900 text-sand-50 hover:bg-ink-700 hover:-translate-y-0.5",
  danger: "bg-red-600 text-white hover:bg-red-700",
  soft: "bg-teal-600 text-white hover:bg-teal-700",
  light: "bg-white text-forest-900 hover:bg-sand-100 shadow-card",
};

export const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-sm",
  lg: "h-[3.25rem] px-8 text-[15px]",
  icon: "h-10 w-10",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/** Class builder for using button styles on links/anchors. */
export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonClass(variant, size, className)} {...props}>
      {children}
    </a>
  );
}
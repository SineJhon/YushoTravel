import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { APP_NAME } from "@/lib/constants";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className={cn("eyebrow", dark && "text-gold-300")}>{eyebrow}</span>
          <span className="gold-rule" aria-hidden />
        </div>
      )}
      <h2
        className={cn(
          "mt-4 text-balance text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-sand-50" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-sand-100/75" : "text-ink-500")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

export function Section({
  children,
  id,
  className,
  tone = "light",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: "light" | "sand" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-28",
        tone === "sand" && "bg-sand-100",
        tone === "dark" && "bg-forest-950 text-sand-50 grain",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Wordmark({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("font-display text-xl font-semibold tracking-tight", dark ? "text-sand-50" : "text-forest-950", className)}>
      Yusho<span className="text-gold-500"> Travel</span>
    </span>
  );
}

export function BrandTag({ dark = false }: { dark?: boolean }) {
  return (
    <span className={cn("text-xs font-medium tracking-wide", dark ? "text-sand-100/70" : "text-ink-500")}>
      {APP_NAME} · {`"ዙረት"`} — journey
    </span>
  );
}
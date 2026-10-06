import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/images/seed/yushologo.webp";

/**
 * The Yusho brand mark (uploaded logo on a white square).
 * Wrap in a fixed-size, white, rounded tile for badges; or size directly.
 */
export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-forest-950 shadow-sm ring-1 ring-ink-200/60",
        className,
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="Yusho Travel logo"
        width={640}
        height={640}
        className={cn("size-full object-cover", imgClassName)}
        priority
      />
    </span>
  );
}
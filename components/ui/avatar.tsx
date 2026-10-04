import Image from "next/image";
import { cn, initials } from "@/lib/utils";
import { resolveImage } from "@/lib/images";

export function Avatar({
  src,
  name,
  className,
  size = 40,
}: {
  src?: string | null;
  name: string;
  className?: string;
  size?: number;
}) {
  if (src) {
    return (
      <Image
        src={resolveImage(src)}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover ring-2 ring-white", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-forest-800 font-semibold text-sand-50 ring-2 ring-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
import Image from "next/image";
import { resolveImage, blurPlaceholder } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  /** aspect ratio class e.g. aspect-[4/3] */
  boxClass?: string;
};

/**
 * Optimized image with lazy loading, WebP/AVIF negotiation and a soft blur
 * placeholder. Always use this instead of <img>.
 */
export function LazyImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
  width = 1200,
  height = 800,
  fill = false,
  boxClass,
}: Props) {
  const resolved = resolveImage(src);
  const container = cn("relative overflow-hidden", boxClass, className);
  const img = cn("object-cover", imgClassName);

  if (fill) {
    return (
      <div className={container}>
        <Image
          src={resolved}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL={blurPlaceholder()}
          className={img}
        />
      </div>
    );
  }

  return (
    <div className={container}>
      <Image
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={blurPlaceholder()}
        className={img}
      />
    </div>
  );
}
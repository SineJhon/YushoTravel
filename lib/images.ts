export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

export function isAllowedImageType(mimeType: string | undefined) {
  return !!mimeType && ALLOWED_IMAGE_TYPES.includes(mimeType);
}

/** Soft, generic SVG placeholder used as blur while images load. */
export function blurPlaceholder(tint = "#e9e2d2") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${tint}"/><circle cx="600" cy="400" r="180" fill="#ffffff" opacity="0.35"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Normalize an image path/URL for display. */
export function resolveImage(src: string | null | undefined): string {
  if (!src) return "/images/seed/hero-alt.webp";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  return `/${src}`;
}

/** Recommended `sizes` for responsive next/image — call-site aware. */
export const imgSizes = {
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  hero: "100vw",
  detail: "(max-width: 768px) 100vw, 66vw",
  avatar: "96px",
} as const;
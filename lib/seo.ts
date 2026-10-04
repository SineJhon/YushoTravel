import type { Metadata } from "next";
import { APP_NAME, SITE_URL, APP_TAGLINE } from "@/lib/constants";

const DEFAULT_IMAGE = `${SITE_URL}/images/seed/hero.webp`;

type SiteMeta = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
};

export function siteMeta({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
}: SiteMeta): Metadata {
  const fullTitle = title
    ? `${title} | ${APP_NAME}`
    : `${APP_NAME} — ${APP_TAGLINE}`;
  const fullDescription =
    description ??
    APP_TAGLINE +
      " Explore. Experience. Connect. Arba Minch tours, southern Ethiopia travel, events and student welcome services by Yusho Travel.";

  const imageUrl = image || DEFAULT_IMAGE;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `${SITE_URL}${path}`,
      siteName: APP_NAME,
      images: [{ url: imageUrl, width: 1200, height: 800, alt: title ?? APP_NAME }],
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
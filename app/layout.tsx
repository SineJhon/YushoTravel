import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_TAGLINE, APP_SUB, SITE_URL } from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    `${APP_TAGLINE} Explore. Experience. Connect. Private and group tours around Arba Minch and southern Ethiopia — Forty Springs, Lake Chamo, Dorze Village and more. Events, student welcome services and unforgettable local experiences.`,
  keywords: [
    "Arba Minch tours",
    "Arba Minch travel",
    "Dorze Village tours",
    "Lake Chamo tours",
    "Forty Springs",
    "Arba Minch tourism",
    "Ethiopia travel",
    "Arba Minch student services",
    "southern Ethiopia",
  ],
  openGraph: {
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: `${APP_SUB} Tours, events and student services in Arba Minch, southern Ethiopia.`,
    url: SITE_URL,
    siteName: APP_NAME,
    images: [`${SITE_URL}/images/seed/hero.webp`],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: `${APP_SUB} Tours, events and student services in Arba Minch.`,
    images: [`${SITE_URL}/images/seed/hero.webp`],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1d15",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-sand-50">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}

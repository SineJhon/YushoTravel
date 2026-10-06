import type { Metadata } from "next";
import { CalendarHeart } from "lucide-react";
import { prisma } from "@/lib/db";
import { siteMeta } from "@/lib/seo";
import { PrivateTourRequest } from "@/components/requests/private-tour-request";

export const metadata: Metadata = siteMeta({
  title: "Private & custom tours",
  description:
    "Request a fully customised private tour around Arba Minch and southern Ethiopia. Your dates, your destinations, your pace — with a real quotation from Yusho Travel.",
  path: "/private-tour",
});

export default async function PrivateTourPage() {
  const destinations = await prisma.destination.findMany({
    where: { active: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-dvh pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <PrivateTourRequest destinations={destinations}>
          <p className="eyebrow">Custom tours</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
            Your journey, <span className="text-teal-700">your rules.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-500">
            Tell us where you want to go and how you like to travel. We&apos;ll design a private
            tour around you — dates, destinations, transport, hotels and food — and send a
            clear quotation. No templates, no pressure.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Multiple destinations in one trip",
              "Private vehicle & driver-guide",
              "Hotel and food arranged if you want",
              "Photography-friendly pacing",
              "Reply within 24 hours with a real quote",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                <CalendarHeart size={17} className="mt-0.5 shrink-0 text-gold-600" /> {item}
              </li>
            ))}
          </ul>
        </PrivateTourRequest>
      </div>
    </div>
  );
}
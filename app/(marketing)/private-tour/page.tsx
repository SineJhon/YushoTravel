import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { siteMeta } from "@/lib/seo";
import { PrivateTourForm } from "@/components/requests/private-tour-form";
import { LazyImage } from "@/components/ui/lazy-image";
import { SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = siteMeta({
  title: "Private & custom tours",
  description:
    "Request a fully customised private tour around Arba Minch and southern Ethiopia. Your dates, your destinations, your pace — with a real quotation from Yusho Travel.",
  path: "/private-tour",
});

export default async function PrivateTourPage() {
  const destinations = await prisma.destination.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-dvh pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Custom tours</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
              Your journey, <span className="text-teal-700">your rules.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-500">
              Tell us where you want to go and how you like to travel. We'll design a private
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
          </div>

          <PrivateTourForm destinations={destinations} />
        </div>

        <section className="mt-24">
          <SectionHeading
            eyebrow="Inspiration"
            title="Popular private tour ideas"
            description="Mix and match any of our destinations — these combos are guest favourites."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: "Classic Arba Minch", tag: "Forty Springs + Lake Chamo", image: "/images/seed/forty-springs-1.webp", time: "2 days, 1 night" },
              { title: "Highlands & Heritage", tag: "Dorze Village + Dorsso Waterfall", image: "/images/seed/dorze-1.webp", time: "1–2 days" },
              { title: "Wildlife Special", tag: "Crocodile Ranch + Crocodile Market", image: "/images/seed/croc-ranch-1.webp", time: "1 day" },
            ].map((idea) => (
              <div key={idea.title} className="group relative overflow-hidden rounded-card">
                <LazyImage src={idea.image} alt={idea.title} boxClass="aspect-[4/3]" sizes="(max-width: 768px) 100vw, 33vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-transparent to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">{idea.time}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-white">{idea.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-sand-100/80">
                    <MapPin size={13} className="text-teal-300" /> {idea.tag}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-400">
            Want something completely different? Use the form above — or{" "}
            <Link href="/contact" className="font-bold text-teal-700 hover:underline">talk to us directly</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
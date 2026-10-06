"use client";

import { CalendarHeart, Check, Clock, MapPin, Sparkles } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export type IdeaDestination = { id: string; name: string; slug: string };

type TourPlan = {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: string;
  /** Short summary of activity types included, e.g. "Boat safari · Culture · Trek" */
  activities: string;
  days: { label: string; slugs: string[] }[];
};

const PRIVATE_TOUR_PLANS: TourPlan[] = [
  {
    id: "whole-experience",
    title: "The Whole Arba Minch Experience",
    duration: "3 days",
    description:
      "Every highlight in one comfortable loop — springs, wildlife lake, highland culture and the waterfall trek.",
    image: "/images/seed/privatearbaminchtour.webp",
    activities: "Nature walks · Boat safari · Culture · Trek",
    days: [
      { label: "Day 1", slugs: ["forty-springs", "crocodile-ranch"] },
      { label: "Day 2", slugs: ["crocodile-market", "lake-chamo"] },
      { label: "Day 3", slugs: ["dorze-village", "dorsso-waterfall"] },
    ],
  },
  {
    id: "classic-arba-minch",
    title: "Classic Arba Minch",
    duration: "2 days",
    description:
      "Begin at the forty springs the city is named after, then spend a full day with the giants of Lake Chamo.",
    image: "/images/seed/lakechamo.webp",
    activities: "Nature walks · Boat safari · Wildlife watching",
    days: [
      { label: "Day 1", slugs: ["forty-springs", "crocodile-ranch"] },
      { label: "Day 2", slugs: ["lake-chamo", "crocodile-market"] },
    ],
  },
  {
    id: "highlands-heritage",
    title: "Highlands & Heritage",
    duration: "1 day",
    description:
      "Meet the Dorze in their bamboo homes above the Rift Valley, then trek the misty highlands to Dorsso Waterfall — all in one day.",
    image: "/images/seed/dorssowaterfall.webp",
    activities: "Village culture · Highland trek",
    days: [{ label: "Day 1", slugs: ["dorze-village", "dorsso-waterfall"] }],
  },
];

export function PrivateTourIdeas({
  destinations,
  activeSlugs,
  onSelectPlan,
}: {
  destinations: IdeaDestination[];
  activeSlugs: string[];
  onSelectPlan: (slugs: string[]) => void;
}) {
  const nameBySlug = new Map(destinations.map((d) => [d.slug, d.name]));

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {PRIVATE_TOUR_PLANS.map((plan, i) => {
        const totalSlugs = plan.days.flatMap((day) => day.slugs);
        const destCount = new Set(totalSlugs).size;
        const active =
          totalSlugs.length === activeSlugs.length &&
          totalSlugs.every((slug) => activeSlugs.includes(slug));

        return (
          <Reveal key={plan.id} delay={i * 70} className="h-full">
            <article
              className={cn(
                "flex h-full flex-col overflow-hidden rounded-card border bg-white transition-all duration-300",
                active
                  ? "border-teal-600/60 shadow-card"
                  : "border-ink-200/40 hover:-translate-y-1 hover:shadow-card-hover",
              )}
            >
              <div className="relative">
                <LazyImage
                  src={plan.image}
                  alt={plan.title}
                  boxClass="aspect-[16/10]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent"
                  aria-hidden
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-forest-950/75 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gold-300 backdrop-blur">
                  <Clock size={12} /> {plan.duration}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="pr-2 font-display text-2xl font-semibold leading-tight text-white">
                    {plan.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm leading-relaxed text-ink-500">{plan.description}</p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-ink-700">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="shrink-0 text-teal-700" /> {destCount} {destCount === 1 ? "destination" : "destinations"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles size={15} className="shrink-0 text-gold-600" /> {plan.activities}
                  </span>
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.days.map((day) => (
                    <li
                      key={day.label}
                      className="flex items-center gap-2.5 rounded-xl border border-ink-200/50 bg-sand-100/60 px-3 py-2.5"
                    >
                      <span className="shrink-0 rounded-md bg-teal-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                        {day.label}
                      </span>
                      <span className="text-sm font-medium text-ink-700">
                        {day.slugs
                          .map((slug) => nameBySlug.get(slug))
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-1 items-end">
                  {active ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => onSelectPlan(totalSlugs)}
                    >
                      <Check size={16} /> This plan is selected
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="gold"
                      size="lg"
                      className="w-full"
                      onClick={() => onSelectPlan(totalSlugs)}
                    >
                      <CalendarHeart size={16} /> Select this plan
                    </Button>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
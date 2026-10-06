import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { Reveal } from "@/components/ui/reveal";
import { imgSizes } from "@/lib/images";

export type ComingSoonEvent = {
  title: string;
  description: string;
  badges: string[];
  image: string;
};

export const comingSoonEvents: ComingSoonEvent[] = [
  {
    title: "A Trip to Dorze Village & Dorsso Waterfall",
    description:
      "One full day out in the Gamo Highlands — food, drinks, transport and everything else taken care of.",
    badges: ["Hiking", "Cultural experience", "Cultural food", "Cultural drink", "Trip"],
    image: "/images/seed/dorssowaterfall.webp",
  },
  {
    title: "Campfire Night at Moche Island in the Woods",
    description:
      "A night deep in the woods on Moche Island — cold drinks, games and a party around the fire.",
    badges: ["Campfire", "Boat ride", "Hiking"],
    image: "/images/seed/mocheisland.webp",
  },
];

export function ComingSoonEventCard({
  event,
  href,
  index = 0,
}: {
  event: ComingSoonEvent;
  href?: string;
  index?: number;
}) {
  const className =
    "group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover";

  const content = (
    <>
      <div className="relative">
        <LazyImage
          src={event.image}
          alt={event.title}
          boxClass="aspect-[16/9]"
          sizes={imgSizes.card}
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-forest-900/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur">
          <Sparkles size={13} /> Coming soon
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 transition-colors group-hover:text-forest-800">
          {event.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{event.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {event.badges.map((item) => (
            <span
              key={item}
              className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-ink-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Reveal delay={index * 70}>
      {href ? (
        <Link href={href} className={className}>
          {content}
        </Link>
      ) : (
        <article className={className}>{content}</article>
      )}
    </Reveal>
  );
}
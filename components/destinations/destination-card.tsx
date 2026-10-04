import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Star } from "lucide-react";
import type { DestinationCard } from "@/lib/data";
import { LazyImage } from "@/components/ui/lazy-image";
import { formatETB } from "@/lib/utils";
import { imgSizes } from "@/lib/images";

export function DestinationCardView({ destination }: { destination: DestinationCard }) {
  const href = `/destinations/${destination.slug}`;
  return (
    <article className="group relative overflow-hidden rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
      <Link href={href} className="absolute inset-0 z-10" aria-label={`Explore ${destination.name}`} />
      <LazyImage
        src={destination.cover ?? "/images/seed/hero-alt.webp"}
        alt={destination.name}
        boxClass="aspect-[4/3]"
        sizes={imgSizes.card}
        className="transition-transform duration-500 group-hover:scale-[1.03]"
        imgClassName="transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-forest-950/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        <MapPin size={11} className="text-gold-400" />
        {destination.location.split(",")[0]}
      </span>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-ink-900 transition-colors group-hover:text-forest-800">
            {destination.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-sand-100 px-2 py-1 text-xs font-semibold text-ink-700">
            <Star size={12} className="fill-gold-500 text-gold-500" />
            {destination.avgRating ? destination.avgRating.toFixed(1) : "New"}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {destination.tagline || destination.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-ink-200/40 pt-4">
          <div className="flex items-center gap-3 text-[13px] text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} className="text-teal-700" /> {destination.duration}
            </span>
            <span className="text-ink-200">·</span>
            <span className="font-semibold text-teal-800">{formatETB(destination.basePrice)}</span>
          </div>
          <span className="relative z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-white transition-all group-hover:bg-gold-400 group-hover:text-forest-950">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
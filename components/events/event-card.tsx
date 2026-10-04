import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { LazyImage } from "@/components/ui/lazy-image";
import { Badge } from "@/components/ui/badge";
import { formatETB } from "@/lib/utils";
import { imgSizes } from "@/lib/images";
import type { EventWithStatus } from "@/lib/data";

function categoryLabel(value: string) {
  return EVENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function EventCard({ event }: { event: EventWithStatus }) {
  const date = new Date(event.date);
  const isUpcoming = event.effectiveStatus === "upcoming";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
      <Link href={`/events/${event.slug}`} className="absolute inset-0 z-10" aria-label={event.title} />
      <div className="relative">
        <LazyImage
          src={event.image ?? "/images/seed/hero-alt.webp"}
          alt={event.title}
          boxClass="aspect-[16/10]"
          sizes={imgSizes.card}
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-sm backdrop-blur">
            <span className="block font-display text-lg font-bold leading-none text-forest-900">{date.getDate()}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-700">
              {date.toLocaleString("en-GB", { month: "short" })}
            </span>
          </span>
          <Badge tone={isUpcoming ? "teal" : "slate"}>{categoryLabel(event.category)}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 transition-colors group-hover:text-forest-800">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-[13px] text-ink-500">
          <p className="flex items-center gap-2"><MapPin size={14} className="text-teal-700" /> {event.location}</p>
          <p className="flex items-center gap-2">
            <Clock size={14} className="text-teal-700" />
            {event.startTime ?? date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}
            <CalendarDays size={14} className="ml-2 text-teal-700" />
            {date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-ink-200/40 pt-4">
          <p className="text-sm">
            {event.price === 0 ? (
              <span className="font-bold text-teal-700">Free</span>
            ) : (
              <span className="font-bold text-forest-800">{formatETB(event.price)}</span>
            )}
            <span className="ml-2 rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
              <Ticket size={10} className="mr-0.5 inline" /> {event.availableSeats} left
            </span>
          </p>
          <span className="relative z-20 flex items-center gap-1 text-sm font-bold text-forest-800 transition-colors group-hover:text-gold-600">
            Details <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </article>
  );
}
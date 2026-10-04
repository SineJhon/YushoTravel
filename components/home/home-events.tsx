import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import type { EventWithStatus } from "@/lib/data";
import { LazyImage } from "@/components/ui/lazy-image";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { buttonClass } from "@/components/ui/button";
import { formatDate, formatETB } from "@/lib/utils";
import { imgSizes } from "@/lib/images";

export function HomeEvents({ events }: { events: EventWithStatus[] }) {
  if (!events.length) return null;
  return (
    <Section tone="sand">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="What's on"
            title="Upcoming events & meet-ups"
            description="Concerts, cultural weekends, hikes and student socials — come as you are."
          />
          <Reveal>
            <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 transition-colors hover:text-teal-700">
              All events <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {events.map((event, i) => (
            <Reveal key={event.id} delay={i * 70}>
              <Link
                href={`/events/${event.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative">
                  <LazyImage
                    src={event.image ?? "/images/seed/hero-alt.webp"}
                    alt={event.title}
                    boxClass="aspect-[16/9]"
                    sizes={imgSizes.card}
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-sm backdrop-blur">
                    <span className="block font-display text-lg font-bold leading-none text-forest-900">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      {new Date(event.date).toLocaleString("en-GB", { month: "short" })}
                    </span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 transition-colors group-hover:text-forest-800">
                    {event.title}
                  </h3>
                  <div className="mt-3 space-y-1.5 text-[13px] text-ink-500">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-teal-700" /> {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} className="text-teal-700" /> {event.startTime ?? formatDate(event.date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Ticket size={14} className="text-teal-700" />
                      {event.price === 0 ? "Free entry" : `${formatETB(event.price)}`}
                      <span className="ml-1 rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                        {event.availableSeats} seats left
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function EventCardActionBar({ event }: { event: EventWithStatus }) {
  return (
    <Link href={`/events/${event.slug}`} className={buttonClass("gold", "md", "mt-4 w-full")}>
      <CalendarDays size={16} />
      Book a seat
    </Link>
  );
}
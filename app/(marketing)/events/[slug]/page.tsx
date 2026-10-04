import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Clock, MapPin, Music, Ticket, UserRound } from "lucide-react";
import { prisma } from "@/lib/db";
import { getEventBySlug } from "@/lib/data";
import { siteMeta } from "@/lib/seo";
import { formatDate, formatDateTime, formatETB, splitList } from "@/lib/utils";
import { SITE_URL, EVENT_CATEGORIES } from "@/lib/constants";
import { LazyImage } from "@/components/ui/lazy-image";
import { Badge } from "@/components/ui/badge";
import { EventBookingPanel } from "@/components/events/event-booking-panel";
import { ReviewList } from "@/components/destinations/review-list";
import { JsonLd } from "@/components/ui/jsonld";
import { imgSizes } from "@/lib/images";

export const revalidate = 120;

export async function generateStaticParams() {
  const rows = await prisma.event.findMany({ select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return siteMeta({ title: event.title, description: event.description.slice(0, 158), path: `/events/${event.slug}`, image: event.image ?? null });
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const categoryLabel = EVENT_CATEGORIES.find((c) => c.value === event.category)?.label ?? event.category;
  const isUpcoming = event.effectiveStatus === "upcoming";
  const rules = splitList(event.rules);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    location: { "@type": "Place", name: event.location, address: { "@type": "PostalAddress", addressLocality: "Arba Minch", addressCountry: "ET" } },
    url: `${SITE_URL}/events/${event.slug}`,
    image: event.image,
    organizer: { "@type": "Organization", name: event.organizer ?? "Yusho Travel" },
  };

  return (
    <div className="min-h-dvh pb-24 pt-24 sm:pt-28">
      <JsonLd data={jsonLd} />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-ink-400">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <ChevronRight size={13} />
          <Link href="/events" className="hover:text-teal-700">Events</Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-ink-700">{event.title}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge tone={isUpcoming ? "teal" : "slate"}>{categoryLabel}</Badge>
          <Badge tone={isUpcoming ? "green" : "slate"} dot>{isUpcoming ? "Upcoming" : "Past"}</Badge>
        </div>

        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">{event.title}</h1>
        <p className="mt-3 flex max-w-3xl items-center gap-2 text-ink-500">
          <MapPin size={16} className="text-teal-700" /> {event.location}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <LazyImage src={event.image ?? "/images/seed/hero-alt.webp"} alt={event.title} boxClass="aspect-[16/9] rounded-[1.75rem] shadow-card" sizes={imgSizes.detail} priority />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={<CalendarDays size={17} />} label="Date" value={formatDate(event.date)} />
              <Stat icon={<Clock size={17} />} label="Starts at" value={event.startTime ?? "—"} />
              <Stat icon={<Ticket size={17} />} label="Entry" value={event.price === 0 ? "Free" : formatETB(event.price)} />
              <Stat icon={<UserRound size={17} />} label="Seats left" value={`${event.availableSeats} / ${event.capacity}`} />
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink-900">About this event</h2>
              <p className="mt-4 whitespace-pre-line text-[16px] leading-8 text-ink-700">{event.description}</p>
            </section>

            {event.organizer && (
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-500">
                <UserRound size={15} className="text-teal-700" /> Organised by <b className="text-ink-900">{event.organizer}</b>
              </p>
            )}

            {rules.length > 0 && (
              <section className="mt-8 rounded-2xl border border-ink-200/40 bg-sand-50 p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                  <Music size={17} className="text-teal-700" /> Rules & notes
                </h2>
                <ul className="mt-3 space-y-2">
                  {rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-sm text-ink-600">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden /> {rule}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {event.endDate && <p className="mt-6 text-sm text-ink-400">Ends {formatDateTime(event.endDate)}</p>}

            <section className="mt-14">
              <div className="flex items-center gap-3">
                <span className="eyebrow">Attendees say</span>
                <span className="gold-rule" />
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900">Reviews</h2>
              <div className="mt-6">
                <ReviewList reviews={event.reviews} />
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <EventBookingPanel eventId={event.id} price={event.price} availableSeats={event.availableSeats} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-200/40 bg-white p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
        <span className="text-teal-700">{icon}</span> {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminEvents } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { LazyImage } from "@/components/ui/lazy-image";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { formatDate, formatETB } from "@/lib/utils";
import { EVENT_STATUS } from "@/lib/constants";

export const metadata: Metadata = siteMeta({ title: "Events", description: "Manage Yusho events.", path: "/admin/events", noindex: true });

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Events</h1>
          <p className="mt-1 text-sm text-ink-500">{events.length} events · seats are managed automatically.</p>
        </div>
        <Link href="/admin/events/new" className={buttonClass("primary", "md")}>
          <Plus size={16} /> New event
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => {
          const status = EVENT_STATUS[event.status] ?? { label: event.status, tone: "slate" as const };
          return (
            <div key={event.id} className="flex flex-col gap-3 rounded-card border border-ink-200/40 bg-white p-4 shadow-card sm:flex-row sm:items-center">
              <LazyImage src={event.image ?? "/images/seed/hero-alt.webp"} alt={event.title} boxClass="aspect-[16/9] w-full shrink-0 rounded-xl sm:w-32" sizes="128px" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-ink-900">{event.title}</h2>
                  <Badge tone={status.tone} dot>{status.label}</Badge>
                  {event.demoSeed && <Badge tone="amber">seed</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{formatDate(event.date)} · {event.location}</p>
                <p className="mt-1 text-xs text-ink-400">
                  {event.price === 0 ? "Free" : formatETB(event.price)} · {event.availableSeats}/{event.capacity} seats left · {event._count.bookings} bookings
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/events/${event.slug}`} target="_blank" className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100">View</Link>
                <Link href={`/admin/events/${event.id}`} className="rounded-full bg-forest-800 px-4 py-2 text-sm font-bold text-white hover:bg-forest-900">Edit</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
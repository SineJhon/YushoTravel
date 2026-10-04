import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { siteMeta } from "@/lib/seo";
import { getEvents } from "@/lib/data";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EmptyState } from "@/components/ui/skeleton";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 120;

export const metadata: Metadata = siteMeta({
  title: "Events",
  description:
    "Concerts, cultural weekends, hikes, student socials and outdoor events in and around Arba Minch, Ethiopia. Book your seat with Yusho Travel.",
  path: "/events",
});

type SearchParams = { [key: string]: string | undefined };

export default async function EventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const scope = sp.scope === "past" ? "past" : "upcoming";
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;
  const search = sp.search?.trim() || undefined;

  const { events, total } = await getEvents({ scope, category, search, limit: 60 });

  return (
    <div className="min-h-dvh bg-sand-50 pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <p className="eyebrow">What's on</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
          Events near <span className="text-teal-700">Arba Minch</span>
        </h1>
        <p className="mt-3 max-w-2xl text-ink-500">
          Concerts, cultural weekends, hikes and student socials — organised with local partners and kept fresh in our events database.
        </p>

        <div className="mt-8">
          <EventFilters scope={scope} category={sp.category ?? "all"} search={sp.search ?? ""} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(["upcoming", "past"] as const).map((s) => (
            <Link
              key={s}
              href={`/events?scope=${s}`}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-6 py-4 font-display text-lg font-semibold transition-all",
                scope === s
                  ? "border-forest-900 bg-forest-900 text-white"
                  : "border-ink-200/60 bg-white text-ink-700 hover:border-forest-900/40",
              )}
            >
              {s === "upcoming" ? "Upcoming events" : "Past events"}
              <CalendarDays size={19} />
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <EmptyState
            className="mt-10"
            icon={<CalendarDays size={24} />}
            title={scope === "upcoming" ? "No upcoming events found" : "No past events found"}
            text="Try another category or search term — or check back soon, we add events regularly."
            action={
              <Link href="/events" className={buttonClass("primary", "md")}>
                View all events
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
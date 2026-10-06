import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import { comingSoonEvents, ComingSoonEventCard } from "@/components/events/coming-soon-event-card";

export const metadata: Metadata = siteMeta({
  title: "Events",
  description:
    "Two new experiences are coming soon in and around Arba Minch, Ethiopia — a trip to Dorze Village & Dorsso Waterfall and a campfire night at Moche Island in the woods.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <div className="min-h-dvh bg-sand-50 pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <p className="eyebrow">What's on</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
          Events near <span className="text-teal-700">Arba Minch</span>
        </h1>
        <p className="mt-3 max-w-2xl text-ink-500">
          Two brand-new experiences are being finalised — here's a first look at what's coming.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {comingSoonEvents.map((event, i) => (
            <ComingSoonEventCard key={event.title} event={event} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { comingSoonEvents, ComingSoonEventCard } from "@/components/events/coming-soon-event-card";

export function HomeEvents() {
  return (
    <Section tone="sand">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="What's on"
            title="Upcoming events & meet-ups"
            description="Two new experiences are being finalised — here's a first look at what's coming."
          />
          <Reveal>
            <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 transition-colors hover:text-teal-700">
              All events <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {comingSoonEvents.map((event, i) => (
            <ComingSoonEventCard key={event.title} event={event} href="/events" index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}
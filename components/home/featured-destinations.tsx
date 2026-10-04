import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DestinationCard } from "@/lib/data";
import { DestinationCardView } from "@/components/destinations/destination-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";

export function FeaturedDestinations({ destinations }: { destinations: DestinationCard[] }) {
  if (!destinations.length) return null;
  return (
    <Section>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Discover"
            title="Featured destinations"
            description="A growing collection of signature places around Arba Minch — each one loaded from our destination database, always fresh."
          />
          <Reveal>
            <Link href="/destinations" className={buttonClass("dark", "md")}>
              Explore all destinations <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, i) => (
            <Reveal key={dest.id} delay={i * 60}>
              <DestinationCardView destination={dest} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
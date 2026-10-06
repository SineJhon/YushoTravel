"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section";
import { PrivateTourForm } from "./private-tour-form";
import { PrivateTourIdeas } from "./private-tour-ideas";

export type RequestDestination = { id: string; name: string; slug: string };

export function PrivateTourRequest({
  destinations,
  children,
}: {
  destinations: RequestDestination[];
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const slugById = useMemo(
    () => new Map(destinations.map((d) => [d.id, d.slug])),
    [destinations],
  );

  const activeSlugs = useMemo(
    () =>
      selected
        .map((id) => slugById.get(id))
        .filter((slug): slug is string => Boolean(slug)),
    [selected, slugById],
  );

  /** Pre-fill the form with a plan's destinations and jump back to it. */
  function applyPlan(slugs: string[]) {
    const ids = slugs
      .map((slug) => destinations.find((d) => d.slug === slug)?.id)
      .filter((id): id is string => Boolean(id));
    if (ids.length === 0) return;
    setSelected(ids);
    document
      .getElementById("private-tour-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function toggleDestination(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  return (
    <>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>{children}</div>
        <PrivateTourForm
          destinations={destinations}
          selected={selected}
          onToggleDestination={toggleDestination}
        />
      </div>

      <section className="mt-24">
        <SectionHeading
          eyebrow="Inspiration"
          title="Popular private tour ideas"
          description="Mix and match our destinations — these day-by-day combos are guest favourites. Pick one and it fills the form above."
        />
        <PrivateTourIdeas
          destinations={destinations}
          activeSlugs={activeSlugs}
          onSelectPlan={applyPlan}
        />
        <p className="mt-8 text-center text-sm text-ink-400">
          Want something completely different? Use the form above — or{" "}
          <Link href="/contact" className="font-bold text-teal-700 hover:underline">
            talk to us directly
          </Link>
          .
        </p>
      </section>
    </>
  );
}
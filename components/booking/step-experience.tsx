"use client";

import { CheckCircle2, MapPin } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { cn, formatETB } from "@/lib/utils";
import type { BookingDestination } from "./types";

export function StepExperience({
  destinations,
  destinationId,
  onSelect,
}: {
  destinations: BookingDestination[];
  destinationId: string;
  onSelect: (destinationId: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Choose your experience</h2>
      <p className="mt-1 text-sm text-ink-500">Where does your journey begin?</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {destinations.map((d) => {
          const selected = d.id === destinationId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={cn(
                "group overflow-hidden rounded-2xl border-2 text-left transition-all",
                selected ? "border-gold-400 shadow-card" : "border-ink-200/50 hover:border-teal-700/40",
              )}
              aria-pressed={selected}
            >
              <div className="relative">
                <LazyImage
                  src={d.cover ?? "/images/seed/hero-alt.webp"}
                  alt={d.name}
                  boxClass="aspect-[16/9]"
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
                {selected && (
                  <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-gold-400 text-forest-950">
                    <CheckCircle2 size={16} />
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold text-ink-900">{d.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                  <MapPin size={12} className="text-teal-700" /> {d.location}
                </p>
                <p className="mt-2 text-xs font-bold text-teal-800">
                  From {d.minPrice > 0 ? formatETB(d.minPrice) : "free"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
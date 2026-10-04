import Link from "next/link";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { formatETB } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { SaveButton } from "@/components/destinations/save-button";
import { QuickFacts } from "@/components/destinations/detail-side";
import type { DestinationBase } from "@/components/destinations/detail-sections";
import { StarRating } from "@/components/ui/star-rating";

export function BookingCard({
  destination,
  destinationId,
  initialSaved,
  avgRating,
  reviewCount,
}: {
  destination: DestinationBase;
  destinationId: string;
  initialSaved: boolean;
  avgRating: number | null;
  reviewCount: number;
}) {
  const cheapest = destination.basePrice;
  return (
    <aside className="rounded-[1.5rem] border border-ink-200/40 bg-white p-6 shadow-card">
      <p className="eyebrow">From</p>
      <p className="mt-2 font-display text-4xl font-bold text-forest-800">
        {formatETB(cheapest)}
        <span className="text-sm font-medium text-ink-400"> / person</span>
      </p>

      <div className="mt-3 flex items-center gap-3">
        <StarRating value={avgRating} showValue />
        <span className="text-sm text-ink-400">
          {reviewCount > 0 ? `${reviewCount} review${reviewCount > 1 ? "s" : ""}` : "New destination"}
        </span>
      </div>

      <div className="my-5 border-t border-ink-200/40 pt-5">
        <QuickFacts destination={destination} />
      </div>

      <Link href={`/book?destination=${destination.slug}`} className={buttonClass("gold", "lg", "w-full")}>
        <Sparkles size={17} /> Book this tour
      </Link>

      <div className="mt-3 flex gap-2">
        <SaveButton destinationId={destinationId} initialSaved={initialSaved} className="flex-1 justify-center" />
        <Link
          href="/private-tour"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink-200/60 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-teal-700/40 hover:text-teal-800"
        >
          <MapPin size={16} /> Customize
        </Link>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-teal-50 p-3.5 text-[13px] leading-relaxed text-teal-900">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-teal-700" />
        Free cancellation while pending. Changing plans? Email us — we're flexible.
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-400">
        Booked securely via your Yusho account · Price confirmed at booking time
      </p>
    </aside>
  );
}
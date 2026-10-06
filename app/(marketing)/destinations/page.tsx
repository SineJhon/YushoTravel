import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { siteMeta } from "@/lib/seo";
import { getDestinations } from "@/lib/data";
import { PRICE_BUCKETS, DURATION_FILTERS } from "@/lib/constants";
import { DestinationCardView } from "@/components/destinations/destination-card";
import { EmptyState } from "@/components/ui/skeleton";
import { Compass } from "lucide-react";

export const metadata: Metadata = siteMeta({
  title: "Destinations",
  description:
    "Explore Arba Minch tours — Forty Springs, Lake Chamo, Dorze Village, Crocodile Ranch, Crocodile Market and Dorsso Waterfall. Private & group tours across southern Ethiopia.",
  path: "/destinations",
});

type SearchParams = { [key: string]: string | undefined };

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() || undefined;
  const category = sp.category && sp.category !== "all" ? sp.category : undefined;
  const region = sp.region && sp.region !== "all" ? sp.region : undefined;
  const priceBucket = PRICE_BUCKETS.find((p) => p.id === sp.price);
  const durationFilter = DURATION_FILTERS.find((d) => d.id === sp.duration);

  const destinations = await getDestinations({
    search,
    category,
    region,
    priceMin: priceBucket?.min,
    priceMax: Number.isFinite(priceBucket?.max) ? priceBucket?.max : undefined,
    durationMax: typeof durationFilter?.max === "number" ? durationFilter.max : undefined,
    sort: sp.sort,
  });

  return (
    <div className="min-h-dvh bg-sand-50 pt-28 sm:pt-32">
      <div className="container-x">
        {/* Page header */}
        <div className="bg-forest-950 grain rounded-[2rem] px-6 py-10 text-sand-50 sm:px-10 sm:py-12">
          <p className="eyebrow !text-gold-300">Discover</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Destinations around <span className="text-gold-400">Arba Minch</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sand-100/70">
            Springs, lakes, highland villages and waterfalls — each one chosen, priced and
            kept fresh from our destination database.
          </p>
        </div>

        <Suspense fallback={<DestinationsGridSkeleton />}>
          <div className="mt-10 grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <DestinationCardView key={dest.id} destination={dest} />
            ))}
          </div>

          {destinations.length === 0 && (
            <EmptyState
              className="mb-24"
              icon={<Compass size={24} />}
              title="No destinations found"
              text="Try a different search — or show all destinations."
              action={
                <Link href="/destinations" className="rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900">
                  Show all destinations
                </Link>
              }
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}

function DestinationsGridSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-card border border-ink-200/40 bg-white p-4">
          <div className="skeleton aspect-[4/3] w-full rounded-xl" />
          <div className="skeleton mt-4 h-5 w-2/3" />
          <div className="skeleton mt-3 h-4 w-full" />
          <div className="skeleton mt-3 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
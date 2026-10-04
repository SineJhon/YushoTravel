import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { getAdminDestinations } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { LazyImage } from "@/components/ui/lazy-image";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { formatETB } from "@/lib/utils";

export const metadata: Metadata = siteMeta({ title: "Destinations", description: "Manage Yusho destinations.", path: "/admin/destinations", noindex: true });

export default async function AdminDestinationsPage() {
  const destinations = await getAdminDestinations();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Destinations</h1>
          <p className="mt-1 text-sm text-ink-500">
            {destinations.length} destinations · images, packages, pricing & availability live here.
          </p>
        </div>
        <Link href="/admin/destinations/new" className={buttonClass("primary", "md")}>
          <Plus size={16} /> New destination
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {destinations.map((d) => (
          <div key={d.id} className="flex flex-col gap-3 rounded-card border border-ink-200/40 bg-white p-4 shadow-card sm:flex-row sm:items-center">
            <LazyImage
              src={d.images[0]?.imageUrl ?? "/images/seed/hero-alt.webp"}
              alt={d.name}
              boxClass="aspect-[4/3] w-full shrink-0 rounded-xl sm:w-28"
              sizes="112px"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-ink-900">{d.name}</h2>
                {d.featured && <Badge tone="gold">Featured</Badge>}
                {!d.active && <Badge tone="slate">Inactive</Badge>}
                {d.demoSeed && <Badge tone="amber">seed</Badge>}
              </div>
              <p className="mt-0.5 text-sm text-ink-500">{d.location}</p>
              <p className="mt-1 text-xs text-ink-400">
                {d.packages.length} packages · {d._count.bookings} bookings · {formatETB(d.basePrice)} from
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/destinations/${d.slug}`} target="_blank" className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100">
                View
              </Link>
              <Link href={`/admin/destinations/${d.id}`} className="rounded-full bg-forest-800 px-4 py-2 text-sm font-bold text-white hover:bg-forest-900">
                Edit
              </Link>
            </div>
          </div>
        ))}
        {destinations.length === 0 && (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-200 p-10 text-sm text-ink-400">
            <Star size={16} /> No destinations yet — create your first one.
          </p>
        )}
      </div>
    </div>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { LazyImage } from "@/components/ui/lazy-image";
import { SaveButton } from "@/components/destinations/save-button";
import { EmptyState } from "@/components/ui/skeleton";
import { buttonClass } from "@/components/ui/button";
import { formatETB } from "@/lib/utils";

export const metadata: Metadata = siteMeta({
  title: "Saved destinations",
  description: "Your saved destinations on Yusho Travel.",
  path: "/account/saved",
  noindex: true,
});

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const saved = await prisma.savedDestination.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: {
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      },
    },
  });

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Saved destinations</h2>
      <p className="mt-1 text-sm text-ink-500">Places you&apos;re dreaming about.</p>

      {saved.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Heart size={24} />}
          title="Nothing saved yet"
          text="Tap the heart on any destination to keep it here for later."
          action={<Link href="/destinations" className={buttonClass("primary", "md")}>Browse destinations</Link>}
        />
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {saved.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-card border border-ink-200/40 bg-white p-4 shadow-card">
              <Link href={`/destinations/${item.destination.slug}`} className="shrink-0">
                <LazyImage
                  src={item.destination.images[0]?.imageUrl ?? "/images/seed/hero-alt.webp"}
                  alt={item.destination.name}
                  boxClass="aspect-square w-24 rounded-xl"
                  sizes="96px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/destinations/${item.destination.slug}`} className="font-display text-lg font-semibold text-ink-900 hover:text-forest-800">
                  {item.destination.name}
                </Link>
                <p className="text-xs text-ink-500">{item.destination.location}</p>
                <p className="mt-1 text-sm font-bold text-teal-800">
                  From {formatETB(item.destination.basePrice)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <SaveButton destinationId={item.destination.id} initialSaved className="!px-3 !py-1.5 text-xs" />
                  <Link href={`/book?destination=${item.destination.slug}`} className="inline-flex items-center gap-1 rounded-full bg-forest-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-forest-900">
                    Book <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
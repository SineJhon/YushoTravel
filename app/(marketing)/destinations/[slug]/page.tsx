            import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { getDestinationBySlug, getRelatedDestinations } from "@/lib/data";
import { isDestinationSavedForUser } from "@/lib/actions/favorites";
import { siteMeta } from "@/lib/seo";
import { splitList, truncate } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/ui/jsonld";
import { DestinationGallery } from "@/components/destinations/destination-gallery";
import { BookingCard } from "@/components/destinations/booking-card";
import { PackagesGrid, FactList } from "@/components/destinations/detail-sections";
import { IncludesTable, MeetingInfoBlock, MapEmbed } from "@/components/destinations/detail-side";
import { ReviewList } from "@/components/destinations/review-list";
import { DestinationCardView } from "@/components/destinations/destination-card";
import { StarRating } from "@/components/ui/star-rating";
import { Reveal } from "@/components/ui/reveal";

export const revalidate = 300;

export async function generateStaticParams() {
  const rows = await prisma.destination.findMany({ where: { active: true }, select: { slug: true } });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  return siteMeta({
    title: destination.name,
    description: destination.tagline ?? truncate(destination.description, 158),
    path: `/destinations/${destination.slug}`,
    image: destination.images[0]?.imageUrl ?? null,
  });
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const [related, saved] = await Promise.all([
    getRelatedDestinations(slug, destination.category, 3),
    isDestinationSavedForUser(destination.id),
  ]);

  const highlights = splitList(destination.highlights);
  const thingsToDo = splitList(destination.thingsToDo);
  const included = splitList(destination.whatsIncluded);
  const excluded = splitList(destination.whatsExcluded);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.tagline ?? destination.description,
    url: `${SITE_URL}/destinations/${destination.slug}`,
    image: destination.images[0]?.imageUrl,
    touristType: destination.category,
  };

  return (
    <div className="min-h-dvh pb-24 pt-24 sm:pt-28">
      <JsonLd data={jsonLd} />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-ink-400">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <ChevronRight size={13} />
          <Link href="/destinations" className="hover:text-teal-700">Destinations</Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-ink-700">{destination.name}</span>
        </nav>

        <div className="mt-6">
          <p className="eyebrow">{destination.region ?? destination.category} · {destination.category}</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">{destination.name}</h1>
              {destination.tagline && <p className="mt-2 max-w-2xl text-lg text-ink-500">{destination.tagline}</p>}
            </div>
            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <MapPin size={15} className="text-teal-700" /> {destination.location}
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={destination.avgRating} showValue />
                <span className="text-sm text-ink-400">({destination.reviewCount} review{destination.reviewCount === 1 ? "" : "s"})</span>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="mt-8">
          <DestinationGallery images={destination.images} name={destination.name} />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <Reveal>
              <p className="dropcap text-[17px] leading-8 text-ink-700"> {destination.description} </p>
            </Reveal>

            {highlights.length > 0 && (
              <Reveal className="mt-10">
                <FactList title="Highlights" items={highlights.slice(0, 6)} icon={Sparkles} />
              </Reveal>
            )}

            {thingsToDo.length > 0 && (
              <Reveal className="mt-5">
                <FactList title="Things to do" items={thingsToDo.slice(0, 6)} icon={MapPin} />
              </Reveal>
            )}

            <Reveal className="mt-5">
              <IncludesTable included={included} excluded={excluded} />
            </Reveal>

            <Reveal className="mt-5">
              <MeetingInfoBlock meetingInfo={destination.meetingInfo} requirements={destination.requirements} />
            </Reveal>

            <Reveal>
              {destination.mapQuery && <MapEmbed mapQuery={destination.mapQuery} name={destination.name} />}
            </Reveal>

            <PackagesGrid destination={destination} packages={destination.packages} />
<section className="mt-14">
              <div className="flex items-center gap-3">
                <span className="eyebrow">Travellers say</span>
                <span className="gold-rule" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <h2 className="font-display text-3xl font-semibold text-ink-900">Reviews</h2>
                {destination.avgRating && (
                  <span className="rounded-full bg-forest-800 px-3 py-1 text-sm font-bold text-white">{destination.avgRating.toFixed(1)}</span>
                )}
              </div>
              <div className="mt-6">
                <ReviewList reviews={destination.reviews} />
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingCard
              destination={destination}
              destinationId={destination.id}
              initialSaved={saved}
              avgRating={destination.avgRating}
              reviewCount={destination.reviewCount}
            />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Keep exploring</span>
              <span className="gold-rule" />
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">Related destinations</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((dest) => (
                <DestinationCardView key={dest.id} destination={dest} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
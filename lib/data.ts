import { prisma } from "@/lib/db";
import type { Destination, Event, Review } from "@prisma/client";

const destinationListInclude = {
  images: { orderBy: { order: "asc" as const }, take: 1 },
  packages: { where: { active: true } },
} as const;

export type DestinationCard = Destination & {
  cover: string | null;
  packages: { id: string; name: string; price: number }[];
  avgRating: number | null;
  reviewCount: number;
};

/** Attach live ratings + cover image to destination rows. */
async function attachRating(rows: Destination[]): Promise<DestinationCard[]> {
  const ids = rows.map((d) => d.id);
  const groups = ids.length
    ? await prisma.review.groupBy({
        by: ["destinationId"],
        where: { approved: true, destinationId: { in: ids } },
        _avg: { rating: true },
        _count: { _all: true },
      })
    : [];
  const stats = new Map(
    groups.map((g) => [g.destinationId, { avg: g._avg.rating, count: g._count._all }]),
  );
  const fullRows = await prisma.destination.findMany({
    where: { id: { in: ids } },
    include: destinationListInclude,
  });
  const fullById = new Map(fullRows.map((d) => [d.id, d]));
  return rows.map((d) => {
    const stat = stats.get(d.id);
    const full = fullById.get(d.id);
    return {
      ...d,
      cover: full?.images[0]?.imageUrl ?? null,
      packages: full?.packages ?? [],
      avgRating: stat?.avg ?? null,
      reviewCount: stat?.count ?? 0,
    };
  });
}

export type DestinationFilters = {
  search?: string;
  category?: string;
  region?: string;
  priceMin?: number;
  priceMax?: number;
  durationMax?: number;
  sort?: string;
};

export async function getDestinations(filters: DestinationFilters = {}) {
  const { search, category, region, priceMin, priceMax, durationMax, sort } = filters;

  const where: Record<string, unknown> = { active: true };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { location: { contains: search } },
      { tagline: { contains: search } },
    ];
  }
  if (category && category !== "all") where.category = category;
  if (region && region !== "all") where.region = region;
  if (typeof priceMin === "number") where.basePrice = { ...(where.basePrice ?? {}), gte: priceMin };
  if (typeof priceMax === "number") where.basePrice = { ...(where.basePrice ?? {}), lte: priceMax };
  if (typeof durationMax === "number") where.durationHours = { lte: durationMax };

  let orderBy: Record<string, "asc" | "desc"> = { featured: "desc" };
  switch (sort) {
    case "rating":
      orderBy = { rating: "desc" };
      break;
    case "price-asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price-desc":
      orderBy = { basePrice: "desc" };
      break;
    case "popular":
      orderBy = { reviewCount: "desc" };
      break;
    default:
      orderBy = { featured: "desc" };
  }

  const rows = await prisma.destination.findMany({
    where,
    orderBy: [{ ...orderBy }, { createdAt: "desc" }],
  });
  return attachRating(rows);
}

export async function getFeaturedDestinations(limit = 6) {
  const rows = await prisma.destination.findMany({
    where: { active: true, featured: true },
    orderBy: { reviewCount: "desc" },
    take: limit,
  });
  if (rows.length === 0) {
    const all = await prisma.destination.findMany({ where: { active: true }, take: limit });
    return attachRating(all);
  }
  return attachRating(rows);
}

export async function getDestinationBySlug(slug: string) {
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      packages: { where: { active: true }, orderBy: { price: "asc" } },
    },
  });
  if (!destination) return null;

  const reviewAgg = await prisma.review.aggregate({
    where: { approved: true, destinationId: destination.id },
    _avg: { rating: true },
    _count: true,
  });

  const reviews = await prisma.review.findMany({
    where: { approved: true, destinationId: destination.id },
    include: { user: { select: { id: true, name: true, profileImage: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return {
    ...destination,
    avgRating: reviewAgg._avg.rating,
    reviewCount: reviewAgg._count,
    reviews,
  };
}

export async function getRelatedDestinations(slug: string, category: string, limit = 3) {
  const rows = await prisma.destination.findMany({
    where: { active: true, slug: { not: slug }, category },
    orderBy: { reviewCount: "desc" },
    take: limit,
  });
  if (rows.length < limit) {
    const extra = await prisma.destination.findMany({
      where: { active: true, slug: { not: slug }, category: { not: category } },
      orderBy: { reviewCount: "desc" },
      take: limit - rows.length,
    });
    rows.push(...extra);
  }
  return attachRating(rows);
}

export async function getActiveDestinationsForSelect() {
  return prisma.destination.findMany({
    where: { active: true },
    select: { id: true, name: true, slug: true, location: true, basePrice: true },
    orderBy: { name: "asc" },
  });
}

export async function getDestinationById(id: string) {
  return prisma.destination.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } }, packages: true },
  });
// ── Events ──────────────────────────────────────────────────────────────────

}
export type EventWithStatus = Event & {
  effectiveStatus: "upcoming" | "past" | "cancelled" | "draft";
};

export function deriveEventStatus(e: Event): EventWithStatus["effectiveStatus"] {
  if (e.status === "CANCELLED") return "cancelled";
  if (e.status === "DRAFT") return "draft";
  return new Date(e.date).getTime() >= Date.now() ? "upcoming" : "past";
}

export async function getEvents(opts: {
  search?: string;
  category?: string;
  scope?: "upcoming" | "past" | "all";
  limit?: number;
  page?: number;
} = {}) {
  const { search, category, scope = "upcoming", limit = 30, page = 1 } = opts;
  const now = new Date();

  const where: Record<string, unknown> = {};
  if (scope !== "all") {
    where.status = scope === "upcoming" ? { notIn: ["CANCELLED", "DRAFT"] } : { in: ["UPCOMING", "PAST"] };
  } else {
    where.status = { notIn: ["DRAFT"] };
  }
  if (search && search.trim()) where.title = { contains: search.trim() };
  if (category && category !== "all") where.category = category;

  const whereWithDate = {
    ...where,
    date: scope === "upcoming" ? { gte: now } : scope === "past" ? { lt: now } : undefined,
  };

  const total = await prisma.event.count({ where: whereWithDate });
  const rows = await prisma.event.findMany({
    where: whereWithDate,
    orderBy: scope === "past" ? { date: "desc" } : { date: "asc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    events: rows.map((e) => ({ ...e, effectiveStatus: deriveEventStatus(e) })),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getUpcomingEvents(limit = 3) {
  const { events } = await getEvents({ scope: "upcoming", limit });
  return events;
}

export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return null;
  const reviews = await prisma.review.findMany({
    where: { approved: true, eventId: event.id },
    include: { user: { select: { id: true, name: true, profileImage: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return {
    ...event,
    effectiveStatus: deriveEventStatus(event),
    reviews,
    bookedCount: event.capacity - event.availableSeats,
  };
}

export async function getFeaturedReviews(limit = 6) {
  const rows = await prisma.review.findMany({
    where: { approved: true, featured: true },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      destination: { select: { name: true, slug: true } },
      booking: { select: { bookingRef: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (rows.length >= 2) return rows;
  const extra = await prisma.review.findMany({
    where: { approved: true, featured: false },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
      destination: { select: { name: true, slug: true } },
      booking: { select: { bookingRef: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit - rows.length,
  });
  return [...rows, ...extra];
}

export type PublicReview = Review & {
  user: { id: string; name: string; profileImage: string | null };
  destination?: { name: string; slug: string } | null;
};

export async function getSearchSuggestions(query: string, limit = 6) {
  const trimmed = query.trim();
  if (!trimmed) {
    return { destinations: [], events: [] as { slug: string; title: string; image: string | null; date: Date; location: string; price: number; category: string }[] };
  }
  const destinations = await prisma.destination.findMany({
    where: { active: true, OR: [{ name: { contains: trimmed } }, { location: { contains: trimmed } }] },
    select: { slug: true, name: true, location: true, basePrice: true },
    take: limit,
  });
  const events = await prisma.event.findMany({
    where: {
      status: { notIn: ["CANCELLED", "DRAFT"] },
      date: { gte: new Date() },
      OR: [{ title: { contains: trimmed } }, { location: { contains: trimmed } }],
    },
    select: {
      slug: true,
      title: true,
      date: true,
      location: true,
      price: true,
      category: true,
      image: true,
    },
    take: limit,
  });
  return { destinations, events };
}
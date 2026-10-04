"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import {
  destinationAdminSchema,
  tourPackageAdminSchema,
  eventAdminSchema,
  imageUrlSchema,
} from "@/lib/validations-admin";
import { z } from "zod";
import { firstError, type ActionRes } from "@/lib/actions/helpers";

const destinationFullSchema = destinationAdminSchema.extend({
  images: z.array(imageUrlSchema).max(12).default([]),
});

type DestinationFields = z.infer<typeof destinationFullSchema>;

function normalizeDestination(fields: Omit<DestinationFields, "images">) {
  return {
    name: fields.name,
    slug: fields.slug,
    tagline: fields.tagline || null,
    description: fields.description,
    location: fields.location,
    region: fields.region || null,
    duration: fields.duration,
    durationHours: fields.durationHours ?? null,
    basePrice: fields.basePrice,
    category: fields.category,
    highlights: fields.highlights || "",
    thingsToDo: fields.thingsToDo || "",
    whatsIncluded: fields.whatsIncluded || null,
    whatsExcluded: fields.whatsExcluded || null,
    requirements: fields.requirements || null,
    meetingInfo: fields.meetingInfo || null,
    latitude: fields.latitude ?? null,
    longitude: fields.longitude ?? null,
    mapQuery: fields.mapQuery || null,
    featured: fields.featured,
    active: fields.active,
  };
}

// ── Destinations ────────────────────────────────────────────────────────────

export async function createDestinationAction(input: unknown): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const parsed = destinationFullSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const slug = parsed.data.slug || slugify(parsed.data.name);
  const exists = await prisma.destination.findUnique({ where: { slug } });
  if (exists) return { ok: false, error: "A destination with that slug already exists." };

  const { images, ...fields } = parsed.data;
  const destination = await prisma.destination.create({
    data: {
      ...normalizeDestination(fields),
      images: {
        create: images
          .filter((url) => url)
          .map((url, i) => ({ imageUrl: url, altText: fields.name, order: i })),
      },
    },
  });

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { ok: true, message: "Destination created.", data: { id: destination.id, slug } };
}

export async function updateDestinationAction(id: string, input: unknown): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const parsed = destinationFullSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Destination not found." };

  const slug = parsed.data.slug || slugify(parsed.data.name);
  const clash = await prisma.destination.findFirst({ where: { slug, id: { not: id } } });
  if (clash) return { ok: false, error: "Another destination already uses that slug." };

  const { images, ...fields } = parsed.data;
  const destination = await prisma.$transaction(async (tx) => {
    const updated = await tx.destination.update({
      where: { id },
      data: normalizeDestination(fields),
    });
    await tx.destinationImage.deleteMany({ where: { destinationId: id } });
    await tx.destinationImage.createMany({
      data: images
        .filter((url) => url)
        .map((url, i) => ({ destinationId: id, imageUrl: url, altText: fields.name, order: i })),
    });
    return updated;
  });

  revalidatePath(`/destinations/${slug}`);
  revalidatePath("/admin/destinations");
  return { ok: true, message: "Destination updated.", data: { id, slug: destination.slug } };
}

export async function deleteDestinationAction(id: string): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const bookings = await prisma.booking.count({ where: { destinationId: id } });
  if (bookings > 0) {
    await prisma.destination.update({
      where: { id },
      data: { active: false, featured: false },
    });
    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return {
      ok: true,
      message: "This destination has bookings, so it was deactivated instead of deleted.",
    };
  }
  await prisma.destination.delete({ where: { id } });
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { ok: true, message: "Destination deleted." };
// ── Tour packages ───────────────────────────────────────────────────────────

}
export async function createTourPackageAction(
  destinationId: string,
  input: unknown,
): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const parsed = tourPackageAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  await prisma.tourPackage.create({
    data: { ...parsed.data, destinationId, minGroupSize: parsed.data.minGroupSize ?? null, maxGroupSize: parsed.data.maxGroupSize ?? null },
  });
  revalidatePath("/admin/destinations");
  return { ok: true, message: "Package added." };
}

export async function updateTourPackageAction(id: string, input: unknown): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const parsed = tourPackageAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  await prisma.tourPackage.update({
    where: { id },
    data: {
      ...parsed.data,
      minGroupSize: parsed.data.minGroupSize ?? null,
      maxGroupSize: parsed.data.maxGroupSize ?? null,
    },
  });
  revalidatePath("/admin/destinations");
  return { ok: true, message: "Package updated." };
}

export async function deleteTourPackageAction(id: string): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const bookings = await prisma.booking.count({ where: { packageId: id } });
  if (bookings > 0) {
    await prisma.tourPackage.update({ where: { id }, data: { active: false } });
    return { ok: true, message: "Package has bookings — deactivated instead of deleted." };
  }
  await prisma.tourPackage.delete({ where: { id } });
  revalidatePath("/admin/destinations");
  return { ok: true, message: "Package deleted." };
}

// ── Events ──────────────────────────────────────────────────────────────────

function eventDataFromParsed(data: z.infer<typeof eventAdminSchema>) {
  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    category: data.category,
    date: new Date(`${data.date}T12:00:00`),
    endDate: data.endDate ? new Date(`${data.endDate}T23:59:00`) : null,
    startTime: data.startTime || null,
    location: data.location,
    price: data.price,
    capacity: data.capacity,
    image: data.image || null,
    gallery: data.gallery || null,
    status: data.status,
    organizer: data.organizer || null,
    rules: data.rules || null,
  };
}

export async function createEventAction(input: unknown): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const parsed = eventAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const slug = parsed.data.slug || slugify(parsed.data.title);
  const exists = await prisma.event.findUnique({ where: { slug } });
  if (exists) return { ok: false, error: "An event with that slug already exists." };

  await prisma.event.create({
    data: { ...eventDataFromParsed(parsed.data), slug, availableSeats: parsed.data.capacity },
  });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true, message: "Event created." };
}

export async function updateEventAction(id: string, input: unknown): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const parsed = eventAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Event not found." };

  const slug = parsed.data.slug || slugify(parsed.data.title);
  const clash = await prisma.event.findFirst({ where: { slug, id: { not: id } } });
  if (clash) return { ok: false, error: "Another event already uses that slug." };

  const capacityDelta = parsed.data.capacity - existing.capacity;
  await prisma.event.update({
    where: { id },
    data: {
      ...eventDataFromParsed(parsed.data),
      slug,
      availableSeats: Math.max(0, existing.availableSeats + capacityDelta),
    },
  });
  revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
  return { ok: true, message: "Event updated." };
}

export async function deleteEventAction(id: string): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const bookings = await prisma.eventBooking.count({ where: { eventId: id } });
  if (bookings > 0) {
    await prisma.event.update({ where: { id }, data: { status: "CANCELLED" } });
    return { ok: true, message: "Event has bookings — marked as cancelled instead." };
  }
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true, message: "Event deleted." };
}
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { bookingSchema, eventBookingSchema } from "@/lib/validations";
import { generateRef, parseJson } from "@/lib/utils";
import { ADD_ON_SERVICES } from "@/lib/constants";
import { firstError, type ActionRes } from "@/lib/actions/helpers";

const MODE_MULTIPLIER: Record<string, number> = { GROUP: 1, PRIVATE: 1.5, FAMILY: 1.2 };

export async function createBookingAction(input: unknown): Promise<ActionRes> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to book a tour." };

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  const destination = await prisma.destination.findUnique({
    where: { id: data.destinationId, active: true },
  });
  if (!destination) return { ok: false, error: "That destination is no longer available." };

  const packageRow = await prisma.tourPackage.findUnique({
    where: { id: data.packageId },
  });
  if (!packageRow || packageRow.destinationId !== destination.id || !packageRow.active) {
    return { ok: false, error: "That tour package is no longer available." };
  }

  if (data.mode === "GROUP" && packageRow.privateOnly) {
    return { ok: false, error: "This package is private-only. Choose the private option." };
  }
  if (packageRow.maxGroupSize && data.numberOfPeople > packageRow.maxGroupSize) {
    return { ok: false, error: `This package supports up to ${packageRow.maxGroupSize} people.` };
  }

  // Server-side pricing — never trust the client.
  const addOns = data.addOns.filter((id) => ADD_ON_SERVICES.some((a) => a.id === id));
  const addOnsTotal = addOns.reduce((sum, id) => {
    const found = ADD_ON_SERVICES.find((a) => a.id === id);
    return sum + (found?.price ?? 0);
  }, 0);
  const multiplier = MODE_MULTIPLIER[data.mode] ?? 1;
  const totalPrice = Math.round(packageRow.price * data.numberOfPeople * multiplier + addOnsTotal);

  const booking = await prisma.booking.create({
    data: {
      bookingRef: generateRef("YS"),
      userId: user.id,
      destinationId: destination.id,
      packageId: packageRow.id,
      date: data.date,
      numberOfPeople: data.numberOfPeople,
      mode: data.mode,
      addOns: JSON.stringify(addOns),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      specialRequest: data.specialRequest || null,
      totalPrice,
      status: "PENDING",
    },
  });

  revalidatePath("/account/bookings");
  revalidatePath("/book");
  revalidatePath(`/destinations/${destination.slug}`);
  return {
    ok: true,
    message: `Booking ${booking.bookingRef} submitted — we'll confirm shortly.`,
    data: { bookingRef: booking.bookingRef, bookingId: booking.id, totalPrice },
  };
}

export async function cancelBookingAction(input: { bookingId: string }): Promise<ActionRes> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to continue." };

  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { destination: { select: { slug: true } } },
  });
  if (!booking || booking.userId !== user.id) {
    return { ok: false, error: "Booking not found." };
  }
  if (
    booking.status === "CANCELLED" ||
    booking.status === "COMPLETED" ||
    booking.status === "REJECTED"
  ) {
    return { ok: false, error: "This booking can no longer be cancelled." };
  }
  if (booking.date.getTime() < Date.now()) {
    return { ok: false, error: "This tour has already passed — contact Yusho for help." };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/account/bookings");
  return { ok: true, message: "Booking cancelled." };
}
export async function createEventBookingAction(input: unknown): Promise<ActionRes> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to book event seats." };

  const parsed = eventBookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event) return { ok: false, error: "That event no longer exists." };
  if (event.status === "CANCELLED" || event.status === "DRAFT") {
    return { ok: false, error: "This event is not open for booking." };
  }
  if (event.date.getTime() < Date.now()) {
    return { ok: false, error: "This event has already taken place." };
  }
  if (data.quantity > event.availableSeats) {
    return { ok: false, error: `Only ${event.availableSeats} seat(s) left.` };
  }

  // Atomic capacity check — protects against overbooking under concurrency.
  const update = await prisma.event.updateMany({
    where: { id: event.id, availableSeats: { gte: data.quantity } },
    data: { availableSeats: { decrement: data.quantity } },
  });
  if (update.count !== 1) {
    return { ok: false, error: "Those seats were just taken. Please try a smaller number." };
  }

  const booking = await prisma.eventBooking.create({
    data: {
      reference: generateRef("EV"),
      userId: user.id,
      eventId: event.id,
      quantity: data.quantity,
      totalPrice: Math.round(event.price * data.quantity),
      attendeeName: data.attendeeName,
      attendeePhone: data.attendeePhone,
      status: "PENDING",
    },
  });

  revalidatePath("/account/bookings");
  revalidatePath(`/events/${event.slug}`);
  return {
    ok: true,
    message: `Event booking ${booking.reference} submitted.`,
    data: { reference: booking.reference, bookingId: booking.id },
  };
}

export async function cancelEventBookingAction(input: { bookingId: string }): Promise<ActionRes> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to continue." };

  const booking = await prisma.eventBooking.findUnique({
    where: { id: input.bookingId },
    include: { event: { select: { slug: true, date: true, id: true } } },
  });
  if (!booking || booking.userId !== user.id) return { ok: false, error: "Booking not found." };
  if (booking.status === "CANCELLED") return { ok: false, error: "Already cancelled." };
  if (booking.event.date.getTime() < Date.now()) {
    return { ok: false, error: "This event has already taken place." };
  }

  await prisma.$transaction([
    prisma.event.update({
      where: { id: booking.event.id },
      data: { availableSeats: { increment: booking.quantity } },
    }),
    prisma.eventBooking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    }),
  ]);

  revalidatePath("/account/bookings");
  revalidatePath(`/events/${booking.event.slug}`);
  return { ok: true, message: "Event booking cancelled." };
}

export async function getBookingDetailForUser(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      destination: { select: { name: true, slug: true, location: true } },
      package: { select: { name: true, duration: true } },
      review: true,
    },
  });
  if (!booking || booking.userId !== userId) return null;
  return { ...booking, addOnsList: parseJson<string[]>(booking.addOns, []) };
}
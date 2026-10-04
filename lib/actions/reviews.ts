"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { firstError, type ActionRes } from "@/lib/actions/helpers";

/**
 * Only completed, verified bookings can be reviewed. One review per booking;
 * one review per user per event. Admin moderation: reviews are live only after
 * approval.
 */
export async function createReviewAction(input: unknown): Promise<ActionRes> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to leave a review." };

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const { bookingId, eventId, rating, comment, image } = parsed.data;

  if (!bookingId && !eventId) {
    return { ok: false, error: "This review isn't linked to any experience." };
  }

  if (bookingId) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.userId !== user.id) {
      return { ok: false, error: "We couldn't find that booking." };
    }
    if (booking.status !== "COMPLETED") {
      return { ok: false, error: "You can review after your tour has been completed." };
    }
    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) return { ok: false, error: "You've already reviewed this booking." };

    await prisma.review.create({
      data: {
        userId: user.id,
        bookingId,
        destinationId: booking.destinationId,
        rating,
        comment,
        image: image || null,
        approved: false,
      },
    });
    revalidatePath("/account/bookings");
    return {
      ok: true,
      message: "Thank you! Your review was submitted for approval.",
    };
  }

  if (eventId) {
    const eventBookings = await prisma.eventBooking.findFirst({
      where: { eventId, userId: user.id, status: "COMPLETED" },
    });
    if (!eventBookings) {
      return { ok: false, error: "Reviews are only available after attending an event." };
    }
    const existing = await prisma.review.findFirst({
      where: { eventId, userId: user.id },
    });
    if (existing) return { ok: false, error: "You've already reviewed this event." };

    await prisma.review.create({
      data: {
        userId: user.id,
        eventId,
        rating,
        comment,
        image: image || null,
        approved: false,
      },
    });
    revalidatePath("/account/bookings");
    return { ok: true, message: "Thank you! Your event review was submitted for approval." };
  }

  return { ok: false, error: "Something went wrong submitting your review." };
}
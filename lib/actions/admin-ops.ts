"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { adminGuard, getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { type ActionRes } from "@/lib/actions/helpers";

const statusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"]);

// ── Booking status (admin) ──────────────────────────────────────────────────
export async function updateBookingStatusAction(input: {
  bookingId: string;
  status: string;
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const status = statusSchema.safeParse(input.status);
  if (!status.success) return { ok: false, error: "Invalid status." };

  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { destination: { select: { slug: true } } },
  });
  if (!booking) return { ok: false, error: "Booking not found." };

  if (status.data === "COMPLETED" && booking.status !== "CONFIRMED") {
    return { ok: false, error: "Mark the booking as confirmed before completing it." };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: status.data },
  });
  revalidatePath("/admin/bookings");
  revalidatePath("/account/bookings");
  revalidatePath(`/destinations/${booking.destination.slug}`);
  return { ok: true, message: `Booking marked ${status.data.toLowerCase()}.` };
}

export async function updateEventBookingStatusAction(input: {
  bookingId: string;
  status: string;
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const status = statusSchema.safeParse(input.status);
  if (!status.success) return { ok: false, error: "Invalid status." };

  const booking = await prisma.eventBooking.findUnique({ where: { id: input.bookingId } });
  if (!booking) return { ok: false, error: "Booking not found." };

  await prisma.eventBooking.update({
    where: { id: booking.id },
    data: { status: status.data },
  });
  revalidatePath("/admin/bookings");
  revalidatePath("/account/bookings");
  return { ok: true, message: `Booking marked ${status.data.toLowerCase()}.` };
}

// ── Review moderation ───────────────────────────────────────────────────────
export async function moderateReviewAction(input: {
  reviewId: string;
  action: "approve" | "hide" | "delete" | "feature" | "unfeature";
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const review = await prisma.review.findUnique({ where: { id: input.reviewId } });
  if (!review) return { ok: false, error: "Review not found." };

  switch (input.action) {
    case "approve":
      await prisma.review.update({ where: { id: review.id }, data: { approved: true } });
      break;
    case "hide":
      await prisma.review.update({
        where: { id: review.id },
        data: { approved: false, featured: false },
      });
      break;
    case "delete":
      await prisma.review.delete({ where: { id: review.id } });
      revalidatePath("/admin/reviews");
      revalidatePath("/destinations", "layout");
      revalidatePath("/events", "layout");
      return { ok: true, message: "Review deleted." };
    case "feature":
      await prisma.review.update({
        where: { id: review.id },
        data: { approved: true, featured: true },
      });
      break;
    case "unfeature":
      await prisma.review.update({ where: { id: review.id }, data: { featured: false } });
      break;
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/destinations", "layout");
  revalidatePath("/events", "layout");
  return { ok: true, message: "Review updated." };
// ── Contact messages ────────────────────────────────────────────────────────
}
export async function setMessageStatusAction(input: {
  messageId: string;
  status: string;
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  const status = z.enum(["NEW", "READ", "HANDLED"]).safeParse(input.status);
  if (!status.success) return { ok: false, error: "Invalid status." };

  await prisma.contactMessage.update({
    where: { id: input.messageId },
    data: { status: status.data },
  });
  revalidatePath("/admin/messages");
  return { ok: true, message: "Message updated." };
}

export async function deleteMessageAction(input: { messageId: string }): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };
  await prisma.contactMessage.delete({ where: { id: input.messageId } });
  revalidatePath("/admin/messages");
  return { ok: true, message: "Message deleted." };
}

// ── Student service requests ────────────────────────────────────────────────
export async function updateStudentServiceStatusAction(input: {
  id: string;
  status: string;
  adminResponse?: string;
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  await prisma.studentService.update({
    where: { id: input.id },
    data: {
      status: input.status,
      adminResponse: input.adminResponse ?? undefined,
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/account/requests");
  return { ok: true, message: "Request updated." };
}

// ── Private tour requests ───────────────────────────────────────────────────
export async function updatePrivateTourStatusAction(input: {
  id: string;
  status: string;
  quotation?: number | null;
  adminResponse?: string;
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  await prisma.privateTourRequest.update({
    where: { id: input.id },
    data: {
      status: input.status,
      quotation: input.quotation ?? null,
      adminResponse: input.adminResponse ?? undefined,
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/account/requests");
  return { ok: true, message: "Request updated." };
}

// ── Users / customers ───────────────────────────────────────────────────────
export async function setUserRoleAction(input: {
  userId: string;
  role: string;
}): Promise<ActionRes> {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") return { ok: false, error: "Admin only." };

  const role = z.enum(["USER", "ADMIN"]).safeParse(input.role);
  if (!role.success) return { ok: false, error: "Invalid role." };

  if (input.userId === admin.id && role.data === "USER") {
    return { ok: false, error: "You can't remove your own admin role." };
  }

  const admins = await prisma.user.count({ where: { role: "ADMIN" } });
  if (role.data === "USER" && admins <= 1) {
    return { ok: false, error: "The platform needs at least one admin." };
  }

  await prisma.user.update({
    where: { id: input.userId },
    data: { role: role.data },
  });
  revalidatePath("/admin/customers");
  return { ok: true, message: "User role updated." };
}

// ── Gallery ─────────────────────────────────────────────────────────────────
export async function addGalleryImageAction(input: {
  imageUrl: string;
  altText?: string;
  caption?: string;
  featured?: boolean;
}): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };

  if (
    !input.imageUrl.trim() ||
    (!input.imageUrl.startsWith("/") && !input.imageUrl.startsWith("http"))
  ) {
    return { ok: false, error: "Provide an upload path or image URL." };
  }

  await prisma.galleryImage.create({
    data: {
      imageUrl: input.imageUrl,
      altText: input.altText || null,
      caption: input.caption || null,
      featured: !!input.featured,
      uploadedBy: (await getCurrentUser())?.id ?? null,
    },
  });
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Image added to gallery." };
}

export async function deleteGalleryImageAction(input: { id: string }): Promise<ActionRes> {
  const { error: authError } = await adminGuard();
  if (authError) return { ok: false, error: authError };
  await prisma.galleryImage.delete({ where: { id: input.id } });
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Image removed." };
}
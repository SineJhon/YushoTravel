"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { studentServiceSchema, privateTourSchema, contactSchema } from "@/lib/validations";
import { clientAddress, ipKey, rateLimit } from "@/lib/rate-limit";
import { firstError, type ActionRes } from "@/lib/actions/helpers";
import { STUDENT_PACKAGES } from "@/lib/constants";

const STUDENT_PACKAGE_IDS = STUDENT_PACKAGES.map((p) => p.id);

export async function createStudentServiceAction(input: unknown): Promise<ActionRes> {
  const parsed = studentServiceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  if (!STUDENT_PACKAGE_IDS.includes(data.package)) {
    return { ok: false, error: "Please choose a valid package." };
  }

  const hdrs = await headers();
  const ip = clientAddress(hdrs.get("x-forwarded-for"));
  const rl = rateLimit(ipKey(ip, "student-service"), 6, 60_000);
  if (!rl.ok) return { ok: false, error: "Too many requests — try again shortly." };

  const user = await getCurrentUser();
  const request = await prisma.studentService.create({
    data: {
      userId: user?.id ?? null,
      package: data.package,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      arrivalDate: data.arrivalDate ? new Date(`${data.arrivalDate}T12:00:00`) : null,
      arrivalLocation: data.arrivalLocation || null,
      numberOfFamilyMembers: data.numberOfFamilyMembers,
      hotelRequired: data.hotelRequired,
      tourRequired: data.tourRequired,
      registrationAssistance: data.registrationAssistance,
      dormitoryAssistance: data.dormitoryAssistance,
      notes: data.notes || null,
      status: "PENDING",
    },
  });

  revalidatePath("/student-services");
  revalidatePath("/account/requests");
  return {
    ok: true,
    message: "Request received — a Yusho team member will contact you soon.",
    data: { id: request.id },
  };
}

export async function createPrivateTourAction(input: unknown): Promise<ActionRes> {
  const parsed = privateTourSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  const hdrs = await headers();
  const ip = clientAddress(hdrs.get("x-forwarded-for"));
  const rl = rateLimit(ipKey(ip, "private-tour"), 6, 60_000);
  if (!rl.ok) return { ok: false, error: "Too many requests — try again shortly." };

  const destinations = await prisma.destination.findMany({
    where: { id: { in: data.destinationIds }, active: true },
    select: { name: true },
  });
  if (destinations.length === 0) return { ok: false, error: "Please choose a destination." };

  const user = await getCurrentUser();
  const request = await prisma.privateTourRequest.create({
    data: {
      userId: user?.id ?? null,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      numberOfPeople: data.numberOfPeople,
      preferredDate: data.preferredDate ? new Date(`${data.preferredDate}T12:00:00`) : null,
      preferredEndDate: data.preferredEndDate ? new Date(`${data.preferredEndDate}T12:00:00`) : null,
      destinations: JSON.stringify(destinations.map((d) => d.name)),
      transportPreference: data.transportPreference || null,
      hotelRequired: data.hotelRequired,
      foodRequired: data.foodRequired,
      specialRequests: data.specialRequests || null,
      budgetRange: data.budgetRange || null,
      status: "PENDING",
    },
  });

  revalidatePath("/private-tour");
  revalidatePath("/account/requests");
  return {
    ok: true,
    message: "Your request is in — we'll reply with a custom quotation.",
    data: { id: request.id },
  };
}

export async function createContactAction(input: unknown): Promise<ActionRes> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = parsed.data;

  const hdrs = await headers();
  const ip = clientAddress(hdrs.get("x-forwarded-for"));
  const rl = rateLimit(ipKey(ip, "contact"), 5, 60_000);
  if (!rl.ok) return { ok: false, error: "Too many messages — try again in a minute." };

  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      status: "NEW",
    },
  });

  return { ok: true, message: "Message sent — we usually reply within one business day." };
}
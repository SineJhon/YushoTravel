import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address");
const optionalPhone = z
  .string()
  .trim()
  .regex(/^[+]?[0-9 ()-]{7,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email,
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Enter your email"),
  password: z.string().min(1, "Enter your password"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: optionalPhone,
  bio: z.string().trim().max(300, "Keep your bio under 300 characters").optional().or(z.literal("")),
  profileImage: z.string().optional().or(z.literal("")),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(72),
});

export const resetRequestSchema = z.object({ email });

export const resetConfirmSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function futureISODate(value: string, ctx: z.RefinementCtx) {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Choose a valid date" });
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed.getTime() < today.getTime()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "The date can't be in the past" });
  }
}

export const bookingSchema = z.object({
  destinationId: z.string().min(1, "Choose a destination"),
  packageId: z.string().min(1, "Choose a package"),
  date: z
    .string()
    .min(1, "Choose a date")
    .superRefine(futureISODate)
    .transform((value) => new Date(`${value}T12:00:00`)),
  numberOfPeople: z.coerce.number().int("Whole number of people").min(1).max(30, "Maximum 30 people"),
  mode: z.enum(["GROUP", "PRIVATE", "FAMILY"]),
  addOns: z.array(z.string()).max(12).optional().default([]),
  customerName: z.string().trim().min(2, "Enter the lead traveller's name").max(80),
  customerPhone: z.string().trim().regex(/^[+]?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  customerEmail: email,
  specialRequest: z.string().trim().max(600).optional().or(z.literal("")),
});

export const eventBookingSchema = z.object({
  eventId: z.string().min(1),
  quantity: z.coerce.number().int().min(1, "At least one ticket").max(20, "Maximum 20 tickets"),
  attendeeName: z.string().trim().min(2).max(80),
  attendeePhone: z.string().trim().regex(/^[+]?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
});

export const reviewSchema = z.object({
  bookingId: z.string().optional(),
  eventId: z.string().optional(),
  rating: z.coerce.number().int().min(1, "Select 1–5 stars").max(5),
  comment: z.string().trim().min(3, "Tell us a little more").max(1000),
  image: z.string().optional().or(z.literal("")),
});

export const studentServiceSchema = z.object({
  package: z.enum(["YUSHO_TOUR", "WELCOME_TOUR", "STAY_WELCOME", "COMPLETE"]),
  fullName: z.string().trim().min(2, "Enter the student's full name").max(100),
  phone: z.string().trim().regex(/^[+]?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  email: email.optional().or(z.literal("")),
  arrivalDate: z.string().optional(),
  arrivalLocation: z.string().trim().max(80).optional().or(z.literal("")),
  numberOfFamilyMembers: z.coerce.number().int().min(0).max(30).default(1),
  hotelRequired: z.boolean().default(false),
  tourRequired: z.boolean().default(false),
  registrationAssistance: z.boolean().default(false),
  dormitoryAssistance: z.boolean().default(false),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
});

export const privateTourSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^[+]?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  email: email.optional().or(z.literal("")),
  numberOfPeople: z.coerce.number().int().min(1, "At least one person").max(40),
  preferredDate: z.string().optional(),
  destinationIds: z.array(z.string()).min(1, "Pick at least one destination"),
  transportPreference: z.string().trim().max(80).optional().or(z.literal("")),
  hotelRequired: z.boolean().default(false),
  foodRequired: z.boolean().default(false),
  specialRequests: z.string().trim().max(1000).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(80).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email,
  phone: optionalPhone,
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Write a short message").max(2000),
});

export const ratingSchema = z.coerce.number().int().min(1).max(5).optional();
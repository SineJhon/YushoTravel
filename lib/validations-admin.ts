import { z } from "zod";

export const imageUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
    "Image must be an upload path or full URL",
  );

export const destinationAdminSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, dashes"),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().min(20, "A real description helps travellers").max(6000),
  location: z.string().trim().min(2).max(150),
  region: z.string().trim().max(80).optional().or(z.literal("")),
  duration: z.string().trim().min(2).max(60),
  durationHours: z.coerce.number().min(1).max(96).optional().nullable(),
  basePrice: z.coerce.number().min(0, "Price must be 0 or more"),
  category: z.string().trim().min(2),
  highlights: z.string().trim().optional().or(z.literal("")),
  thingsToDo: z.string().trim().optional().or(z.literal("")),
  whatsIncluded: z.string().trim().optional().or(z.literal("")),
  whatsExcluded: z.string().trim().optional().or(z.literal("")),
  requirements: z.string().trim().optional().or(z.literal("")),
  meetingInfo: z.string().trim().optional().or(z.literal("")),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  mapQuery: z.string().trim().max(150).optional().or(z.literal("")),
  featured: z.preprocess((v) => v === "true" || v === true, z.boolean().default(false)),
  active: z.preprocess((v) => v === "true" || v === true, z.boolean().default(true)),
});

export const tourPackageAdminSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(600).optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  duration: z.string().trim().max(60).optional().or(z.literal("")),
  minGroupSize: z.coerce.number().int().min(0).max(50).optional().nullable(),
  maxGroupSize: z.coerce.number().int().min(0).max(100).optional().nullable(),
  privateOnly: z.preprocess((v) => v === "true" || v === true, z.boolean().default(false)),
  active: z.preprocess((v) => v === "true" || v === true, z.boolean().default(true)),
});

export const eventAdminSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, dashes"),
  description: z.string().trim().min(20).max(6000),
  category: z.string().trim().min(2),
  date: z.string().min(1, "Choose a date"),
  endDate: z.string().optional().or(z.literal("")),
  startTime: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().min(2).max(150),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  capacity: z.coerce.number().int().min(1).max(10000),
  image: imageUrlSchema.optional().or(z.literal("")),
  gallery: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["UPCOMING", "PAST", "CANCELLED", "DRAFT"]),
  organizer: z.string().trim().max(80).optional().or(z.literal("")),
  rules: z.string().trim().max(2000).optional().or(z.literal("")),
});
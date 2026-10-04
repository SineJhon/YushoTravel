import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  const [destinations, events] = await Promise.all([
    prisma.destination.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true, rating: true },
    }),
    prisma.event.findMany({
      where: { status: { notIn: ["CANCELLED", "DRAFT"] } },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), priority: 1, changeFrequency: "weekly" },
    { url: `${base}/destinations`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/events`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${base}/private-tour`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/student-services`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.5, changeFrequency: "monthly" },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: d.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...destinationRoutes, ...eventRoutes];
}
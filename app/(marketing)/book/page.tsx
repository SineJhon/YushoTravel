import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { BookingWizard } from "@/components/booking/booking-wizard";
import type { BookingDestination } from "@/components/booking/types";

export const metadata: Metadata = siteMeta({
  title: "Book a tour",
  description:
    "Book private and group tours around Arba Minch — Forty Springs, Lake Chamo, Dorze Village and more — in four simple steps.",
  path: "/book",
});

export default async function BookPage({ searchParams }: { searchParams: Promise<{ destination?: string; package?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/book");
  const sp = await searchParams;

  const rows = await prisma.destination.findMany({
    where: { active: true },
    select: {
      id: true,
      slug: true,
      name: true,
      location: true,
      category: true,
      images: { orderBy: { order: "asc" }, take: 1, select: { imageUrl: true } },
      packages: { where: { active: true }, orderBy: { price: "asc" }, select: { id: true, name: true, price: true, duration: true, privateOnly: true, maxGroupSize: true } },
    },
    orderBy: { name: "asc" },
  });

  const destinations: BookingDestination[] = rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    location: d.location,
    category: d.category,
    cover: d.images[0]?.imageUrl ?? null,
    minPrice: d.packages[0]?.price ?? 0,
    packages: d.packages,
  }));

  return (
    <div className="min-h-dvh pb-24 pt-24 sm:pt-28">
      <div className="container-x">
        <p className="eyebrow">Book a tour</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
          Your Yusho is four steps away
        </h1>
        <p className="mt-2 max-w-xl text-ink-500">
          Experience → Details → Review → Confirmation. Everything is saved to your real account.
        </p>

        <div className="mt-8">
          <BookingWizard
            destinations={destinations}
            user={{ name: user.name, email: user.email, phone: user.phone ?? "" }}
            initialDestination={sp.destination ?? undefined}
            initialPackage={sp.package ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}
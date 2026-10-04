import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Ticket } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { BookingListItem } from "@/components/account/booking-list-item";
import { EmptyState } from "@/components/ui/skeleton";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = siteMeta({
  title: "My bookings",
  description: "View and manage your Yusho Travel bookings.",
  path: "/account/bookings",
  noindex: true,
});

export default async function AccountBookingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [bookings, eventBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        destination: { select: { name: true, slug: true, images: { take: 1 } } },
        package: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventBooking.findMany({
      where: { userId: user.id },
      include: { event: { select: { title: true, slug: true, image: true, date: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const allCount = bookings.length + eventBookings.length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">My bookings</h2>
          <p className="text-sm text-ink-500">{allCount} total · tours & events</p>
        </div>
        <Link href="/book" className={buttonClass("gold", "md")}>Book a tour</Link>
      </div>

      {allCount === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<CalendarDays size={24} />}
          title="No bookings yet"
          text="Book your first tour or grab an event seat — it takes about a minute."
          action={<Link href="/destinations" className={buttonClass("primary", "md")}>Explore destinations</Link>}
        />
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <BookingListItem
              key={booking.id}
              type="tour"
              booking={{
                id: booking.id,
                bookingRef: booking.bookingRef,
                date: booking.date,
                numberOfPeople: booking.numberOfPeople,
                totalPrice: booking.totalPrice,
                status: booking.status,
                createdAt: booking.createdAt,
                mode: booking.mode,
                packageName: booking.package.name,
                title: booking.destination.name,
                image: booking.destination.images[0]?.imageUrl,
                destinationSlug: booking.destination.slug,
              }}
            />
          ))}
          {eventBookings.map((eb) => (
            <BookingListItem
              key={eb.id}
              type="event"
              booking={{
                id: eb.id,
                bookingRef: eb.reference,
                date: eb.event.date,
                quantity: eb.quantity,
                totalPrice: eb.totalPrice,
                status: eb.status,
                createdAt: eb.createdAt,
                title: eb.event.title,
                image: eb.event.image,
                eventSlug: eb.event.slug,
              }}
            />
          ))}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-ink-400">
        <Ticket size={14} className="text-teal-700" />
        Need help? <Link href="/contact" className="font-bold text-teal-700 hover:underline">Contact Yusho</Link> — we're fast to reply.
      </p>
    </div>
  );
}
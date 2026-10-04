import Link from "next/link";
import { ArrowUpRight, CalendarDays, Compass, Heart, Inbox, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BookingListItem } from "@/components/account/booking-list-item";
import { buttonClass } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [bookings, eventBookings, savedCount, studentServices, privateTours, reviewCount] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: user.id },
      include: { destination: { select: { name: true, slug: true } }, package: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.eventBooking.count({ where: { userId: user.id } }),
    prisma.savedDestination.count({ where: { userId: user.id } }),
    prisma.studentService.count({ where: { userId: user.id } }),
    prisma.privateTourRequest.count({ where: { userId: user.id } }),
    prisma.review.count({ where: { userId: user.id } }),
  ]);

  const upcoming = bookings.filter((b) => b.date.getTime() > Date.now()).length;

  const stats = [
    { label: "Upcoming tours", value: upcoming, href: "/account/bookings", icon: <CalendarDays size={18} /> },
    { label: "Event bookings", value: eventBookings, href: "/account/bookings", icon: <Compass size={18} /> },
    { label: "Saved places", value: savedCount, href: "/account/saved", icon: <Heart size={18} /> },
    { label: "Reviews left", value: reviewCount, href: "/account/reviews", icon: <Star size={18} /> },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Overview</h2>
      <p className="mt-1 text-sm text-ink-500">Everything happening in your Yusho world, at a glance.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group rounded-card border border-ink-200/40 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">{stat.icon}</span>
            <p className="mt-3 font-display text-3xl font-bold text-ink-900">{stat.value}</p>
            <p className="text-[13px] font-semibold text-ink-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink-900">Recent bookings</h3>
            <Link href="/account/bookings" className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:underline">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {bookings.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
                No bookings yet —{" "}
                <Link href="/destinations" className="font-bold text-teal-700 hover:underline">start exploring</Link>.
              </p>
            ) : (
              bookings.map((booking) => (
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
                    packageName: booking.package.name,
                    title: booking.destination.name,
                    destinationSlug: booking.destination.slug,
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <Inbox size={17} className="text-teal-700" /> Requests
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {studentServices} student service request{studentServices === 1 ? "" : "s"} · {privateTours} private tour request{privateTours === 1 ? "" : "s"}
            </p>
            <Link href="/account/requests" className={buttonClass("outline", "sm", "mt-4 w-full")}>View requests</Link>
          </div>
          <div className="rounded-card bg-forest-950 p-5 text-sand-50 grain">
            <h3 className="font-display text-lg font-semibold">Ready for the next one?</h3>
            <p className="mt-1 text-sm text-sand-100/70">A new destination at a great group price.</p>
            <Link href="/book" className={buttonClass("gold", "sm", "mt-4 w-full")}>
              <Compass size={15} /> Book a tour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
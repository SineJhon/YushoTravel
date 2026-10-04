import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, ClipboardList, Mail, Phone, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { CancelBookingButton } from "@/components/account/cancel-booking-button";
import { ReviewForm } from "@/components/account/review-form";
import { ADD_ON_SERVICES, BOOKING_MODES, BOOKING_STATUS } from "@/lib/constants";
import { formatDate, formatETB, parseJson } from "@/lib/utils";

export const metadata: Metadata = siteMeta({
  title: "Booking details",
  description: "Your Yusho booking details and options.",
  path: "/account/bookings",
  noindex: true,
});

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      destination: { select: { name: true, slug: true, location: true, images: { take: 1 } } },
      package: { select: { name: true, duration: true, price: true } },
      review: true,
    },
  });
  if (!booking || booking.userId !== user.id) notFound();

  const status = BOOKING_STATUS[booking.status] ?? { label: booking.status, tone: "slate" as const };
  const addOns = parseJson<string[]>(booking.addOns, []);
  const cancellable = (booking.status === "PENDING" || booking.status === "CONFIRMED") && booking.date.getTime() > Date.now();

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-[13px] text-ink-400">
        <Link href="/account/bookings" className="hover:text-teal-700">My bookings</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-ink-700">{booking.bookingRef}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-3xl font-semibold text-ink-900">{booking.destination.name}</h2>
        <Badge tone={status.tone} dot>{status.label}</Badge>
      </div>
      <p className="mt-1 text-sm text-ink-500">{booking.package.name}</p>

      <dl className="mt-6 grid gap-4 rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card sm:grid-cols-2">
        <InfoRow icon={<ClipboardList size={16} />} label="Booking reference" value={booking.bookingRef} />
        <InfoRow icon={<CalendarDays size={16} />} label="Travel date" value={formatDate(booking.date)} />
        <InfoRow icon={<Users size={16} />} label="Travellers" value={`${booking.numberOfPeople} ${booking.numberOfPeople === 1 ? "person" : "people"}`} />
        <InfoRow icon={<ClipboardList size={16} />} label="Mode" value={BOOKING_MODES[booking.mode]?.label ?? booking.mode} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={booking.customerPhone} />
        <InfoRow icon={<Mail size={16} />} label="Email" value={booking.customerEmail} />
        <div className="sm:col-span-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
            <ClipboardList size={14} className="text-teal-700" /> What's included
          </p>
          <p className="mt-1 text-sm font-medium text-ink-900">{formatETB(booking.totalPrice)} total</p>
          {addOns.length > 0 && (
            <p className="mt-1 text-sm text-ink-500">
              Add-ons: {addOns.map((id) => ADD_ON_SERVICES.find((a) => a.id === id)?.label ?? id).join(", ")}
            </p>
          )}
        </div>
        {booking.specialRequest && (
          <div className="sm:col-span-2 rounded-2xl bg-sand-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Special request</p>
            <p className="mt-1 text-sm text-ink-700">{booking.specialRequest}</p>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        {cancellable && <CancelBookingButton bookingId={booking.id} type="tour" />}
        <Link href={`/destinations/${booking.destination.slug}`} className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100">
          View destination
        </Link>
        <Link href="/contact" className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100">
          Contact Yusho
        </Link>
      </div>

      {booking.status === "COMPLETED" && (
        <div className="mt-8 rounded-3xl border border-teal-700/20 bg-teal-50/50 p-6">
          <h3 className="font-display text-xl font-semibold text-ink-900">
            {booking.review ? "Thanks for reviewing this trip! 🎉" : "How was your tour?"}
          </h3>
          {!booking.review && (
            <div className="mt-4 max-w-xl">
              <ReviewForm bookingId={booking.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
        <span className="text-teal-700">{icon}</span> {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}
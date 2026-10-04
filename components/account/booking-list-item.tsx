import Link from "next/link";
import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatETB } from "@/lib/utils";
import { BOOKING_STATUS, EVENT_BOOKING_STATUS } from "@/lib/constants";
import { CancelBookingButton } from "./cancel-booking-button";

export function BookingListItem({
  booking,
  type,
}: {
  booking: {
    id: string;
    bookingRef: string;
    date: Date;
    numberOfPeople?: number;
    quantity?: number;
    totalPrice: number;
    status: string;
    createdAt: Date;
    mode?: string | null;
    packageName?: string;
    title: string;
    image?: string | null;
    destinationSlug?: string;
    eventSlug?: string;
  };
  type: "tour" | "event";
}) {
  const statusInfo = (type === "tour" ? BOOKING_STATUS : EVENT_BOOKING_STATUS)[booking.status] ?? { label: booking.status, tone: "slate" as const };
  const detailHref = type === "tour" ? `/account/bookings/${booking.id}` : `/events/${booking.eventSlug}`;
  const cancellingAllowed =
    (booking.status === "PENDING" || booking.status === "CONFIRMED") && booking.date.getTime() > Date.now();

  return (
    <article className="flex flex-col gap-4 rounded-card border border-ink-200/40 bg-white p-5 shadow-card transition-all hover:shadow-card-hover sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-forest-800 font-display font-bold text-gold-400">
          {booking.title
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold text-ink-900">{booking.title}</h3>
            {booking.packageName && <span className="truncate text-xs text-ink-400">{booking.packageName}</span>}
          </div>
          <p className="mt-0.5 text-sm text-ink-500">
            <span className="font-mono text-[12px] text-ink-400">{booking.bookingRef}</span>
            <span className="mx-2 text-ink-200">·</span>
            <CalendarDays size={13} className="mr-1 inline text-teal-700" />
            {formatDate(booking.date)}
            <span className="mx-2 text-ink-200">·</span>
            <Users size={13} className="mr-1 inline text-teal-700" />
            {booking.numberOfPeople ?? booking.quantity ?? 1} {type === "tour" ? "travellers" : "tickets"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-right">
          <Badge tone={statusInfo.tone} dot>{statusInfo.label}</Badge>
          <p className="mt-1 font-bold text-forest-800">{formatETB(booking.totalPrice)}</p>
        </div>
        <div className="flex items-center gap-2">
          {cancellingAllowed && <CancelBookingButton bookingId={booking.id} type={type} />}
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-forest-900"
          >
            Details <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminBookings } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { BookingStatusSelect } from "@/components/admin/status-select";
import { SearchForm } from "@/components/admin/search-input";
import { BOOKING_STATUS } from "@/lib/constants";
import { formatDate, formatETB, cn } from "@/lib/utils";

export const metadata: Metadata = siteMeta({ title: "Bookings", description: "Manage Yusho bookings.", path: "/admin/bookings", noindex: true });

type SP = { [key: string]: string | undefined };

type AdminRow = {
  id: string;
  status: string;
  totalPrice: number;
  reference?: string;
  bookingRef?: string;
  date?: Date;
  numberOfPeople?: number;
  quantity?: number;
  attendeeName?: string | null;
  event?: { title: string; slug: string; date: Date } | null;
  destination?: { name: string; slug: string } | null;
  user?: { name?: string } | null;
};

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const type = sp.type === "event" ? "event" : "tour";
  const status = sp.status ?? "all";
  const search = sp.search ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const { rows, total, pages } = await getAdminBookings({ page, status, type, search, pageSize: 20 });

  const q = (overrides: Record<string, string>) => {
    const params = new URLSearchParams({ type, status, search, page: "1", ...overrides });
    return `/admin/bookings?${params.toString()}`;
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Bookings</h1>
      <p className="mt-1 text-sm text-ink-500">{total} results · update statuses directly from the list.</p>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2">
          <Link href={q({ type: "tour" })} className={cn("rounded-full px-4 py-2 text-sm font-semibold", type === "tour" ? "bg-forest-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200")}>Tours</Link>
          <Link href={q({ type: "event" })} className={cn("rounded-full px-4 py-2 text-sm font-semibold", type === "event" ? "bg-forest-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200")}>Events</Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchForm
            action="/admin/bookings"
            params={[["type", type], ["status", status]]}
            defaultValue={search}
            placeholder="Search ref, name, place…"
          />
          <Link href={q({ status: "all" })} className={cn("rounded-full px-3 py-2 text-xs font-bold", status === "all" ? "bg-forest-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200")}>All</Link>
          {Object.keys(BOOKING_STATUS).map((s) => (
            <Link key={s} href={q({ status: s })} className={cn("rounded-full px-3 py-2 text-xs font-bold", status === s ? "bg-forest-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200")}>{BOOKING_STATUS[s].label}</Link>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-200/40 bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200/40 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">{type === "tour" ? "Destination" : "Event"}</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
{rows.map((row) => {
              const r = row as AdminRow;
              const isEvent = type === "event";
              const title = isEvent ? r.event?.title ?? "" : r.destination?.name ?? "";
              const slug = isEvent ? r.event?.slug : r.destination?.slug;
              const customer = isEvent ? r.attendeeName ?? r.user?.name : r.user?.name;
              const date = isEvent ? r.event?.date : r.date;
              const ref = isEvent ? r.reference : r.bookingRef;
              const seats = isEvent ? `${r.quantity} seat(s)` : `${r.numberOfPeople} people`;
              const statusInfo = BOOKING_STATUS[r.status] ?? { label: r.status, tone: "slate" as const };
              return (
                <tr key={r.id} className="border-b border-ink-200/30 last:border-0 hover:bg-sand-50">
                  <td className="px-4 py-3 font-mono text-[12px]">{ref}</td>
                  <td className="px-4 py-3 font-semibold">
                    <Link href={`/${isEvent ? "events" : "destinations"}/${slug}`} target="_blank" className="hover:text-teal-700">{title}</Link>
                    <span className="block text-xs font-normal text-ink-400">{seats}</span>
                  </td>
                  <td className="px-4 py-3">{customer}</td>
                  <td className="px-4 py-3">{date ? formatDate(date) : "—"}</td>
                  <td className="px-4 py-3 font-bold">{formatETB(r.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookingStatusSelect bookingId={r.id} current={r.status} type={isEvent ? "event" : "tour"} />
                      <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-400">No bookings match your filters.</td></tr>}
          </tbody>
        </table>
      </div>

{pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={q({ page: String(page - 1) })} className="flex size-9 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-sand-100" aria-label="Previous page">
              <ChevronLeft size={16} />
            </Link>
          )}
          <span className="px-3 text-sm font-semibold text-ink-600">Page {page} of {pages}</span>
          {page < pages && (
            <Link href={q({ page: String(page + 1) })} className="flex size-9 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-sand-100" aria-label="Next page">
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
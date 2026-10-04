import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Compass, Inbox, MessageSquare, Star, TrendingUp, Users } from "lucide-react";
import { getAdminDashboardStats, getRecentActivity } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { formatETB, formatDateTime } from "@/lib/utils";
import { BOOKING_STATUS } from "@/lib/constants";

export const metadata: Metadata = siteMeta({ title: "Admin dashboard", description: "Yusho Travel administration.", path: "/admin", noindex: true });

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const activity = await getRecentActivity();

  const cards: { label: string; value: string; icon: React.ReactNode; href: string; tone: string }[] = [
    { label: "Total revenue", value: formatETB(stats.revenue), icon: <TrendingUp size={20} />, href: "/admin/bookings", tone: "bg-teal-50 text-teal-700" },
    { label: "Total bookings", value: String(stats.totalBookings), icon: <Inbox size={20} />, href: "/admin/bookings", tone: "bg-sand-200 text-ink-700" },
    { label: "Pending", value: String(stats.pendingBookings), icon: <Compass size={20} />, href: "/admin/bookings?status=PENDING", tone: "bg-gold-100 text-gold-800" },
    { label: "Upcoming tours", value: String(stats.upcomingTours), icon: <CalendarDays size={20} />, href: "/admin/bookings", tone: "bg-forest-100 text-forest-800" },
    { label: "Event seats pending", value: String(stats.eventBookingsPending), icon: <CalendarDays size={20} />, href: "/admin/bookings?type=event", tone: "bg-teal-50 text-teal-700" },
    { label: "Student & tour requests", value: String(stats.studentServices + stats.privateTours), icon: <Users size={20} />, href: "/admin/services", tone: "bg-sand-200 text-ink-700" },
    { label: "Reviews awaiting", value: String(stats.reviewsPending), icon: <Star size={20} />, href: "/admin/reviews", tone: "bg-gold-100 text-gold-800" },
    { label: "New messages", value: String(stats.newMessages), icon: <MessageSquare size={20} />, href: "/admin/messages", tone: "bg-forest-100 text-forest-800" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">
        {stats.totalDestinations} destinations · {stats.totalEvents} events · {stats.totalUsers} customers
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-card border border-ink-200/40 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <span className={`inline-flex size-10 items-center justify-center rounded-xl ${card.tone}`}>{card.icon}</span>
            <p className="mt-3 truncate font-display text-xl font-bold text-ink-900">{card.value}</p>
            <p className="text-xs font-semibold text-ink-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-bold text-teal-700 hover:underline">View all</Link>
        </div>
        <div className="mt-4 divide-y divide-ink-200/40">
          {activity.bookings.length === 0 && <p className="py-6 text-center text-sm text-ink-400">No bookings yet.</p>}
          {activity.bookings.slice(0, 8).map((b) => {
            const status = BOOKING_STATUS[b.status] ?? { label: b.status, tone: "slate" as const };
            return (
              <div key={b.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{b.destination.name}</p>
                  <p className="text-xs text-ink-400">{b.user.name} · {formatDateTime(b.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={status.tone} dot>{status.label}</Badge>
                  <span className="text-sm font-bold text-forest-800">{formatETB(b.totalPrice)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <QuickLinks href="/admin/services" title="Student & private-tour requests" count={`${stats.studentServices} student · ${stats.privateTours} private`} />
        <QuickLinks href="/admin/messages" title="Contact messages" count={`${stats.newMessages} unread of ${stats.totalMessages}`} />
      </div>
    </div>
  );
}

function QuickLinks({ href, title, count }: { href: string; title: string; count: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-card border border-ink-200/40 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div>
        <p className="font-display text-lg font-semibold text-ink-900 group-hover:text-forest-800">{title}</p>
        <p className="mt-1 text-sm text-ink-500">{count}</p>
      </div>
      <span className="text-teal-700">Manage →</span>
    </Link>
  );
}
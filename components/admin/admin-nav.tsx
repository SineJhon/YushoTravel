"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Compass,
  ExternalLink,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} />, end: true },
  { href: "/admin/destinations", label: "Destinations", icon: <Compass size={17} /> },
  { href: "/admin/events", label: "Events", icon: <CalendarDays size={17} /> },
  { href: "/admin/bookings", label: "Bookings", icon: <Inbox size={17} /> },
  { href: "/admin/services", label: "Services & requests", icon: <Settings size={17} /> },
  { href: "/admin/reviews", label: "Reviews", icon: <Star size={17} /> },
  { href: "/admin/customers", label: "Customers", icon: <Users size={17} /> },
  { href: "/admin/messages", label: "Messages", icon: <MessageSquare size={17} /> },
  { href: "/admin/gallery", label: "Gallery", icon: <ImageIcon size={17} /> },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await logoutAction();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
      <Link
        href="/"
        target="_blank"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:bg-sand-100 lg:w-full"
      >
        <ExternalLink size={15} /> View site
      </Link>
      {nav.map((item) => {
        const active = item.end ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full",
              active ? "bg-forest-900 text-white" : "text-ink-600 hover:bg-sand-100 hover:text-ink-900",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.icon} <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={signOut}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 lg:w-full"
      >
        Sign out
      </button>
    </aside>
  );
}
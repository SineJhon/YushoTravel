"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, Inbox, LayoutDashboard, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/account", label: "Overview", icon: <LayoutDashboard size={17} />, end: true },
  { href: "/account/bookings", label: "My bookings", icon: <CalendarDays size={17} /> },
  { href: "/account/saved", label: "Saved destinations", icon: <Heart size={17} /> },
  { href: "/account/requests", label: "Requests", icon: <Inbox size={17} /> },
  { href: "/account/reviews", label: "My reviews", icon: <Star size={17} /> },
  { href: "/account/settings", label: "Settings", icon: <Settings size={17} /> },
];

export function AccountTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col lg:gap-1.5">
      {tabs.map((tab) => {
        const active = tab.end ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full",
              active ? "bg-forest-900 text-white" : "text-ink-600 hover:bg-sand-100 hover:text-ink-900",
            )}
            aria-current={active ? "page" : undefined}
          >
            {tab.icon} <span className="whitespace-nowrap">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
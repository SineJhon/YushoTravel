"use client";

import Link from "next/link";
import { CalendarDays, MapPin, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import type { HeaderUser } from "./site-header-client";

export function MobileDrawer({
  open,
  onClose,
  isActive,
  onSignOut,
  user,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  onSignOut: () => void;
  user: HeaderUser | null;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex flex-col bg-forest-950 text-sand-50 grain transition-all duration-300 lg:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      aria-hidden={!open}
    >
      <div className="container-x flex items-center justify-between py-5">
        <span className="font-display text-xl font-bold">
          Yusho<span className="text-gold-400"> Travel</span>
        </span>
        <button
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="container-x mt-4 flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "border-b border-white/10 py-4 font-display text-3xl font-semibold text-sand-50 transition-colors hover:text-gold-300",
              isActive(link.href) && "text-gold-300",
            )}
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-6 flex gap-3">
          <Link href="/book" onClick={onClose} className="flex-1 rounded-full bg-gold-400 py-3.5 text-center text-sm font-bold text-forest-950">
            Book a tour
          </Link>
          {!user && (
            <Link href="/login" onClick={onClose} className="flex-1 rounded-full border border-white/25 py-3.5 text-center text-sm font-bold text-white">
              Sign in
            </Link>
          )}
        </div>
        {user && (
          <div className="mt-4 flex flex-wrap gap-2 pb-8 text-sm">
            <Link href="/account" onClick={onClose} className="rounded-full bg-white/10 px-4 py-2.5 font-semibold">
              My account
            </Link>
            <Link href="/account/bookings" onClick={onClose} className="rounded-full bg-white/10 px-4 py-2.5 font-semibold">
              Bookings
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" onClick={onClose} className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-2.5 font-semibold text-teal-200">
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
            <button onClick={onSignOut} className="rounded-full bg-white/10 px-4 py-2.5 font-semibold text-red-300">
              Sign out
            </button>
          </div>
        )}
      </nav>

      <div className="container-x flex items-center gap-2 border-t border-white/10 py-5 text-xs text-sand-100/60">
        <MapPin size={14} className="text-gold-400" />
        Arba Minch, Southern Ethiopia
        <span className="ml-auto flex items-center gap-1.5">
          <CalendarDays size={14} className="text-gold-400" /> since 2024
        </span>
      </div>
    </div>
  );
}
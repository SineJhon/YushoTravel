"use client";

import Link from "next/link";
import { ChevronDown, Compass, Heart, LayoutDashboard, LogOut, Menu, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import type { HeaderUser } from "./site-header-client";

export function SiteHeaderBar({
  user, transparent, isActive, onSignOut, onMenuOpen, accountOpen, onAccountToggle,
}: {
  user: HeaderUser | null;
  transparent: boolean;
  isActive: (href: string) => boolean;
  onSignOut: () => void;
  onMenuOpen: () => void;
  accountOpen: boolean;
  onAccountToggle: () => void;
}) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent ? "bg-transparent py-4" : "border-b border-ink-200/40 bg-sand-50/90 py-2 shadow-sm backdrop-blur-md",
      )}
    >
      <div className="container-x flex items-center justify-between">
        <Link href="/" className="relative z-10 flex items-center gap-2" aria-label="Yusho Travel home">
          <span className={cn("flex size-9 items-center justify-center rounded-xl font-display text-lg font-bold", transparent ? "bg-gold-400 text-forest-950" : "bg-forest-900 text-gold-400")}>Y</span>
          <span className="leading-tight">
            <span className={cn("block font-display text-lg font-bold tracking-tight", transparent ? "text-white" : "text-forest-950")}>Yusho Travel</span>
            <span className={cn("block text-[10px] font-medium uppercase tracking-[0.28em]", transparent ? "text-sand-100/70" : "text-teal-700")}>ዙረት · journey</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                transparent ? "text-sand-50/90 hover:text-white" : "text-ink-700 hover:text-forest-950",
                isActive(link.href) && (transparent ? "text-white" : "text-forest-950 underline underline-offset-8 decoration-gold-400"),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button onClick={onAccountToggle} className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-white/10" aria-haspopup="menu" aria-expanded={accountOpen} aria-label="Account menu">
                <Avatar src={user.profileImage} name={user.name} size={34} className="ring-forest-950/10" />
                <span className={cn("hidden max-w-28 truncate text-sm font-semibold sm:block", transparent ? "text-white" : "text-ink-900")}>{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className={cn(transparent ? "text-white/70" : "text-ink-500", accountOpen && "rotate-180 transition-transform")} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-ink-200/50 bg-white p-2 shadow-pop animate-scale-in">
                  <div className="border-b border-ink-200/50 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                  </div>
                  <div className="pt-1.5">
                    {user.role === "ADMIN" && <BarLink href="/admin" icon={<LayoutDashboard size={16} />} label="Admin dashboard" />}
                    <BarLink href="/account" icon={<UserIcon size={16} />} label="My account" />
                    <BarLink href="/account/bookings" icon={<Compass size={16} />} label="My bookings" />
                    <BarLink href="/account/saved" icon={<Heart size={16} />} label="Saved" />
                    <button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50">
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/login" className={cn("rounded-full px-4 py-2 text-sm font-semibold", transparent ? "text-white hover:bg-white/10" : "text-ink-700 hover:text-forest-950")}>Sign in</Link>
              <Link href="/register" className={cn("rounded-full px-5 py-2 text-sm font-semibold", transparent ? "bg-white/15 text-white backdrop-blur hover:bg-white/25" : "bg-forest-900 text-white hover:bg-forest-950")}>Join free</Link>
            </div>
          )}

          <Link href="/book" className="hidden rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-forest-950 shadow-glow-gold transition-all hover:-translate-y-0.5 hover:bg-gold-300 md:inline-flex">
            Book a tour
          </Link>

          <button onClick={onMenuOpen} className={cn("flex size-10 items-center justify-center rounded-full transition-colors lg:hidden", transparent ? "text-white hover:bg-white/10" : "text-ink-900 hover:bg-forest-900/5")} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

function BarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900">
      <span className="text-teal-700">{icon}</span>
      {label}
    </Link>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  MapPin,
  Route,
  Users,
} from "lucide-react";
import { HERO_IMAGE } from "@/lib/constants";
import { buttonClass } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";

const stats = [
  { icon: <MapPin size={17} />, value: "6+", label: "Signature destinations" },
  { icon: <Compass size={17} />, value: "100%", label: "Local-born guides" },
  { icon: <Users size={17} />, value: "3 in 1", label: "Tour · Event · Student" },
];

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const parallaxY = Math.min(offset * 0.22, 160);

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        aria-hidden
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-kenburns"
        />
      </div>

      {/* Cinematic tint — photo stays bright, text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-950/55 via-forest-950/15 to-forest-950/45" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/45 via-forest-900/20 to-transparent" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,14,10,0.28)_100%)]" aria-hidden />

      <div className="container-x relative z-10 pb-24 pt-24 lg:pb-40">
        <div className="min-w-0 max-w-3xl">
          {/* Eyebrow pill */}
          <p
            className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-forest-950/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-200 backdrop-blur"
            style={{ animationDelay: "100ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden />
            ዙረት · Arba Minch · Ethiopia
          </p>
          <h1
            className="mt-8 animate-fade-up [filter:drop-shadow(0_2px_10px_rgba(6,14,10,0.45))] font-display text-5xl font-semibold leading-[1.04] tracking-tight text-white text-balance sm:text-6xl lg:text-[5.25rem]"
            style={{ animationDelay: "200ms" }}
          >
            Your Journey
            <span className="block bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600 bg-clip-text text-transparent">
              Starts Here.
            </span>
          </h1>

          <p
            className="mt-7 animate-fade-up hero-text-shadow inline-flex items-center gap-3 text-lg font-semibold tracking-wide text-sand-50 sm:text-xl"
            style={{ animationDelay: "320ms" }}
          >
            Explore <span className="h-0.5 w-9 bg-gold-400" aria-hidden />
            Experience <span className="h-0.5 w-9 bg-gold-400" aria-hidden />
            Connect
          </p>

          <div className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "430ms" }}>
            <Link href="/destinations" className={buttonClass("gold", "lg", "shadow-glow-gold")}>
              Explore Destinations <ArrowRight size={17} />
            </Link>
            <Link
              href="/private-tour"
              className={buttonClass("ghost", "lg", "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20")}
            >
              <Route size={17} /> Plan Your Journey
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-10 flex animate-fade-up items-center gap-4" style={{ animationDelay: "540ms" }}>
            <div className="flex -space-x-2.5">
              <Avatar src="/images/seed/avatar-1.webp" name="Yusho traveller" size={36} />
              <Avatar src="/images/seed/avatar-3.webp" name="Yusho traveller" size={36} />
              <Avatar src="/images/seed/avatar-5.webp" name="Yusho traveller" size={36} />
              <Avatar src="/images/seed/avatar-6.webp" name="Yusho traveller" size={36} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <StarRating value={4.9} size={13} showValue={false} />
                <span className="text-sm font-bold text-white">4.9/5</span>
              </div>
              <p className="text-xs leading-snug text-sand-100/75">Loved by 120+ travellers around Arba Minch</p>
            </div>
          </div>
        </div>

        {/* Icon stats chips */}
        <dl className="mt-16 grid animate-fade-up grid-cols-1 gap-3 sm:grid-cols-3" style={{ animationDelay: "680ms" }}>
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-forest-950/50 px-4 py-3 backdrop-blur">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">{s.icon}</span>
              <div className="min-w-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-lg font-semibold leading-none text-white">{s.value}</dd>
                <dd className="mt-0.5 truncate text-[12px] leading-snug text-sand-100/80">{s.label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/75">
        <ChevronDown size={20} />
      </div>

      <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-1.5 rounded-full border border-white/20 bg-forest-950/65 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur lg:flex">
        <MapPin size={12} className="text-gold-400" /> Arba Minch Ethiopia
      </div>
    </section>
  );
}
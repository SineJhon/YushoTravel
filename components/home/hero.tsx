"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { HERO_IMAGE } from "@/lib/constants";
import { buttonClass } from "@/components/ui/button";

const stats = [
  { value: "6", label: "Signature destinations" },
  { value: "100%", label: "Local-born guides" },
  { value: "Tour · Event · Student", label: "Three ways to travel with Yusho" },
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

      {/* Deep forest gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/45 to-forest-950/80" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,14,10,0.55)_100%)]" aria-hidden />

      <div className="container-x relative z-10 pb-24 pt-32">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-up !text-gold-300" style={{ animationDelay: "120ms" }}>
            ዙረት · Arba Minch · Southern Ethiopia
          </p>

          <h1 className="mt-6 animate-fade-up font-display text-5xl font-semibold leading-[1.04] tracking-tight text-white text-balance sm:text-6xl lg:text-[5.25rem]" style={{ animationDelay: "220ms" }}>
            Your Journey
            <span className="block text-gold-400">Starts Here.</span>
          </h1>

          <p className="mt-6 animate-fade-up text-lg font-medium tracking-wide text-sand-100/90 sm:text-xl" style={{ animationDelay: "340ms" }}>
            Explore. Experience. Connect.
          </p>

          {/* Journey path */}
          <svg className="mt-8 h-10 w-full max-w-md animate-fade-in" viewBox="0 0 400 40" fill="none" aria-hidden style={{ animationDelay: "450ms" }}>
            <path d="M4 20 C 60 44, 120 -8, 180 18 S 300 42, 396 12" stroke="rgba(230,178,58,0.55)" strokeWidth="2" className="journey-path" />
            <circle cx="4" cy="20" r="4" fill="#e6b23a" />
            <circle cx="396" cy="12" r="5" fill="#e6b23a" stroke="#0e1d15" strokeWidth="2" />
          </svg>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "560ms" }}>
            <Link href="/destinations" className={buttonClass("gold", "lg")}>
              Explore Destinations
            </Link>
            <Link
              href="/private-tour"
              className={buttonClass("ghost", "lg", "border border-white/40 text-white hover:bg-white/10")}
            >
              Plan Your Journey
            </Link>
          </div>

          <dl className="mt-14 grid animate-fade-up grid-cols-1 gap-4 border-t border-white/15 pt-7 sm:grid-cols-3" style={{ animationDelay: "680ms" }}>
            {stats.map((s) => (
              <div key={s.label} className="pr-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold text-white">{s.value}</dd>
                <dd className="mt-0.5 text-[13px] leading-snug text-sand-100/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/60">
        <ChevronDown size={22} />
      </div>

      <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-1.5 rounded-full bg-forest-950/50 px-3 py-1.5 text-[11px] font-medium text-sand-100/80 backdrop-blur lg:flex">
        <MapPin size={12} className="text-gold-400" /> Southern Ethiopia — the Rift Valley
      </div>
    </section>
  );
}
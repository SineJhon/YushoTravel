import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";
import { APP_TAGLINE } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 sm:py-28">
      <div className="container-x text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold-300">ዙረት — let's go</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Ready to Go on a Yusho?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-sand-100/75">
            {APP_TAGLINE} Pick a destination, grab your people, and let a local team make it unforgettable.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book" className={buttonClass("gold", "lg")}>
              Book a Tour <ArrowRight size={17} />
            </Link>
            <Link href="/contact" className={buttonClass("ghost", "lg", "border border-white/35 text-white hover:bg-white/10")}>
              <Phone size={16} /> Contact Us
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="absolute -bottom-24 left-1/2 h-64 w-[52rem] -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" aria-hidden />
    </section>
  );
}
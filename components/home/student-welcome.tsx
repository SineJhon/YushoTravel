import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";

const items = [
  "Receiving at the airport or bus station",
  "Accommodation & hotel arrangement",
  "University orientation & campus navigation",
  "Registration-process & form-filling guidance",
  "Dormitory-process guidance to your room",
  "Optional family tours around Arba Minch",
];

export function StudentWelcome() {
  return (
    <section className="relative overflow-hidden bg-forest-950 grain py-20 text-sand-50 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal dir="left">
          <div className="relative">
            <div className="absolute -inset-4 -z-0 rounded-[2rem] bg-teal-500/15 blur-2xl" aria-hidden />
            <LazyImage
              src="/images/seed/amu.webp"
              alt="Arba Minch University"
              boxClass="aspect-[4/3] rounded-[1.75rem] shadow-pop"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
            <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-gold-400 px-5 py-4 text-forest-950 shadow-pop sm:-right-6 animate-float">
              <GraduationCap size={28} />
              <div>
                <p className="font-display text-lg font-bold leading-tight">New students welcome</p>
                <p className="text-xs font-semibold">We help you arrive, register and settle in</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal dir="right" delay={120}>
          <p className="eyebrow !text-teal-300">Student Welcome</p>
          <h2 className="mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            New to Arba Minch?
            <span className="block text-gold-400">Let us handle the arrival.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sand-100/70">
            Newly assigned to Arba Minch University — or travelling with a student? Yusho
            helps families receive students, arrange stays and walk through every official
            process with a friendly local guide by your side.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-sand-100/85">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-teal-300" />
                {item}
              </li>
            ))}
          </ul>

          <Link href="/student-services" className={buttonClass("gold", "lg", "mt-9")}>
            Explore Student Services
            <ArrowRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
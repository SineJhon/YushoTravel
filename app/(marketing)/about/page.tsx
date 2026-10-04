import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Globe2, Handshake, Sparkles } from "lucide-react";
import { siteMeta } from "@/lib/seo";
import { LazyImage } from "@/components/ui/lazy-image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = siteMeta({
  title: "About Yusho",
  description:
    "Yusho Travel is a modern travel, tour, events and student-experience company based in Arba Minch, southern Ethiopia.",
  path: "/about",
});

const values = [
  { icon: <Globe2 size={20} />, title: "Rooted in Arba Minch", text: "We live here. Our guides, drivers and partners are neighbours — the knowledge is real, not rehearsed." },
  { icon: <Compass size={20} />, title: "Modern & youthful", text: "Clear booking, honest pricing, real communication. Travel the way you already live your life." },
  { icon: <Handshake size={20} />, title: "Trustworthy by nature", text: "We promise what we can deliver, we deliver what we promise, and we're one call away." },
  { icon: <Sparkles size={20} />, title: "Premium but accessible", text: "Memorable experiences with local prices — generous hospitality, not luxury markup." },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">ዙረት · The Yusho story</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
              A journey word, a <span className="text-gold-600">community</span> company
            </h1>
            <p className="mt-5 text-[17px] leading-8 text-ink-600">
              <b>Yusho</b> is a Gamo word for going around — exploring, travelling,
              experiencing place. That’s exactly what we do: take people around Arba Minch and
              southern Ethiopia and help them feel the region the way we feel it.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-ink-600">
              What started as students helping students has grown into a travel, tour, events
              and welcome company — still young, still local, and now able to host visitors
              from across Ethiopia and the world.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/destinations" className={buttonClass("primary", "md")}>Explore the region</Link>
              <Link href="/student-services" className={buttonClass("ghost", "md", "border border-ink-200")}>Student services</Link>
            </div>
          </div>

          <Reveal dir="right">
            <div className="relative">
              <LazyImage src="/images/seed/hero-alt.webp" alt="Southern Ethiopia — the Rift Valley" boxClass="aspect-[4/3] rounded-[2rem] shadow-pop" sizes="(max-width: 1024px) 100vw, 48vw" priority />
              <div className="absolute -bottom-5 -left-2 rounded-2xl bg-gold-400 px-5 py-4 text-forest-950 shadow-pop sm:-left-6">
                <p className="font-display text-lg font-bold leading-tight">እንሂድ — let's go.</p>
                <p className="text-xs font-semibold">Explore · Experience · Connect</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Section tone="sand">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four things you can hold us to"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 60} className="rounded-card border border-ink-200/40 bg-white p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-600 text-white">{v.icon}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <div className="container-x py-20">
        <div className="grid items-center gap-8 rounded-[2rem] bg-forest-900 p-8 text-sand-50 grain sm:p-12 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-semibold">Meet the team in Arba Minch</h2>
            <p className="mt-3 max-w-xl text-sand-100/75">
              Our office is in Sikela, a quick hop from the springs and the lakes. Pop in for
              coffee and a map — we love planning trips almost as much as running them.
            </p>
          </div>
          <Link href="/contact" className={buttonClass("gold", "lg")}>Visit us / Contact</Link>
        </div>
      </div>
    </div>
  );
}
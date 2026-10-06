import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, HeartHandshake, ShieldCheck, Target } from "lucide-react";
import { siteMeta } from "@/lib/seo";
import { LOGO_SRC } from "@/components/ui/logo";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = siteMeta({
  title: "About Yusho",
  description:
    "Yusho Travel is a modern travel, tour, events and student-experience company based in Arba Minch, southern Ethiopia.",
  path: "/about",
});

const pillars = [
  {
    icon: <Target size={20} />,
    title: "Our mission",
    text: "Making southern Ethiopia easy to explore. We run honest, well-planned tours, events and student experiences so every visitor and newcomer can feel the region the way we do.",
  },
  {
    icon: <Eye size={20} />,
    title: "Our vision",
    text: "A southern Ethiopia everyone can reach. We want every traveller, family and student to leave with the same warmth, wonder and welcome we grew up with here.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Our promise",
    text: "Transparent from the first message to the last mile. Clear prices, honest plans and someone real who answers when you call — no surprises, ever.",
  },
  {
    icon: <HeartHandshake size={20} />,
    title: "Our community",
    text: "We hire local guides, work with local families and make sure every guest and student leaves the region better connected than they found it.",
  },
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
              <div className="overflow-hidden rounded-[2rem] bg-white p-6 shadow-pop ring-1 ring-ink-200/60 sm:p-10">
                <Image
                  src={LOGO_SRC}
                  alt="Yusho Travel logo"
                  width={640}
                  height={640}
                  priority
                  className="aspect-square size-full object-contain"
                />
              </div>
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
            eyebrow="Why we exist"
            title="Our mission & vision"
            description="The promises and principles behind everything we plan, host and run."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 60} className="rounded-card border border-ink-200/40 bg-white p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-600 text-white">{p.icon}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <div className="container-x pb-20">
        <div className="grid items-center gap-8 rounded-[2rem] bg-forest-900 p-8 text-sand-50 grain sm:p-12 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-semibold">We come to you</h2>
            <p className="mt-3 max-w-xl text-sand-100/75">
              Always in Arba Minch, and always one message away. Tell us where your
              journey begins and we'll be waiting.
            </p>
          </div>
          <Link href="/contact" className={buttonClass("gold", "lg")}>Reach the team</Link>
        </div>
      </div>
    </div>
  );
}
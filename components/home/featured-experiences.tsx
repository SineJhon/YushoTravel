import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_EXPERIENCES } from "@/lib/constants";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LazyImage } from "@/components/ui/lazy-image";
import { imgSizes } from "@/lib/images";

export function FeaturedExperiences() {
  return (
    <Section>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Experiences"
            title="More than destinations — moments"
            description="Pick a feeling, not just a place. Every experience can be made private, family-friendly or custom for you."
          />
          <Reveal>
            <Link href="/destinations" className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 transition-colors hover:text-teal-700">
              View all destinations <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 60}>
              <Link href={exp.href} className="group relative block overflow-hidden rounded-card">
                <LazyImage
                  src={exp.image}
                  alt={exp.title}
                  boxClass="aspect-[4/5]"
                  sizes={imgSizes.card}
                  imgClassName="transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/25 to-transparent" aria-hidden />
                <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all group-hover:bg-gold-400 group-hover:text-forest-950">
                  <ArrowUpRight size={18} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
                    {String(i + 1).padStart(2, "0")} · Experience
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold text-white">{exp.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sand-100/70">{exp.text}</p>
                  <p className="mt-3 text-sm font-bold text-gold-300 group-hover:text-gold-200">
                    {exp.cta} →
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
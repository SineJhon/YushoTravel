import { Compass, HeartHandshake, MapPinned, Route, Sparkles, Users } from "lucide-react";
import { WHY_YUSHO } from "@/lib/constants";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const icons: Record<string, React.ReactNode> = {
  local: <MapPinned size={22} />,
  guides: <Compass size={22} />,
  flexible: <Route size={22} />,
  students: <Users size={22} />,
  trust: <HeartHandshake size={22} />,
  memories: <Sparkles size={22} />,
};

export function WhyYusho() {
  return (
    <Section tone="sand">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Yusho?"
          title="A local team that treats your journey like our own"
          description="We're not a faceless booking platform. We're Arba Minch — drivers, guides, organisers and friends who want you to fall in love with our corner of Ethiopia."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_YUSHO.map((item, i) => (
            <Reveal
              key={item.key}
              delay={i * 60}
              className="group rounded-card border border-ink-200/40 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-700/30 hover:shadow-card-hover"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-forest-800 text-gold-400 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                {icons[item.key] ?? <Sparkles size={22} />}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { siteMeta } from "@/lib/seo";
import { StudentServicesSection } from "@/components/requests/student-services-section";
import { LazyImage } from "@/components/ui/lazy-image";
import { STUDENT_PACKAGES, STUDENT_SERVICES_LIST } from "@/lib/constants";

export const metadata: Metadata = siteMeta({
  title: "Student services — Arba Minch",
  description:
    "Arriving at Arba Minch University? Yusho Travel helps students and families with receiving, accommodation, registration guidance, dormitory guidance and orientation.",
  path: "/student-services",
});

export default function StudentServicesPage() {
  return (
    <div className="min-h-dvh pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Student Welcome</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
              New to Arba Minch?
              <span className="block text-teal-700">We'll get you settled.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-500">
              Newly assigned to Arba Minch University, or travelling with a student? Yusho
              helps families arrive, stay and register with confidence — a local team
              guiding you through every official step, honestly and carefully.
            </p>
            <div className="mt-8 rounded-3xl border border-ink-200/40 bg-sand-100 p-6">
              <p className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                <GraduationCap size={20} className="text-teal-700" /> We can assist with
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {STUDENT_SERVICES_LIST.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <LazyImage
              src="/images/seed/amu.webp"
              alt="Arba Minch University"
              boxClass="aspect-[4/3] rounded-[2rem] shadow-pop"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              priority
            />
            <div className="absolute -bottom-5 left-6 rounded-2xl bg-white px-5 py-4 shadow-card">
              <p className="font-display text-sm font-bold text-ink-900">Arrival → Dormitory</p>
              <p className="text-xs text-ink-500">We support the whole journey</p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <p className="eyebrow">Three packages</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Choose how much help you need
          </h2>
          <p className="mt-2 max-w-2xl text-ink-500">
            From a simple family tour to full arrival-to-dorm support — every package is
            customised around the student&apos;s arrival plan.
          </p>
          <StudentServicesSection services={STUDENT_PACKAGES} />
        </div>
      </div>
    </div>
  );
}
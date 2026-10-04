"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { STUDENT_PACKAGES, STUDENT_DISCLAIMER } from "@/lib/constants";
import { Modal } from "@/components/ui/modal";
import { LazyImage } from "@/components/ui/lazy-image";
import { StudentServiceForm } from "./student-service-form";

export function StudentServicesSection({ services }: { services: readonly (typeof STUDENT_PACKAGES)[number][] }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {services.map((pkg) => (
          <article
            key={pkg.id}
            className="relative flex flex-col overflow-hidden rounded-[1.5rem] border border-ink-200/40 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            {pkg.popular && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold text-forest-950">
                Most requested
              </span>
            )}
            <div className="relative">
              <LazyImage src={pkg.image} alt={pkg.shortName} boxClass="aspect-[16/7]" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" aria-hidden />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl font-semibold text-ink-900">{pkg.shortName}</h3>
              <p className="mt-1 text-sm text-ink-500">{pkg.tagline}</p>
              <ul className="mt-4 space-y-2">
                {pkg.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-1 items-end justify-between gap-3">
                <p className="text-sm font-bold text-teal-800">{pkg.price}</p>
                <button
                  onClick={() => setSelected(pkg.id)}
                  className="rounded-full bg-forest-800 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-forest-900"
                >
                  Book / Request service
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 flex items-start gap-2.5 rounded-2xl border border-forest-900/15 bg-forest-50 p-5 text-[13px] leading-relaxed text-forest-900">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-forest-700" />
        {STUDENT_DISCLAIMER}
      </p>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? services.find((p) => p.id === selected)?.name ?? "Request service" : "Request service"}
        maxWidth="max-w-xl"
      >
        <StudentServiceForm initialPackage={selected ?? "WELCOME_TOUR"} />
      </Modal>
    </div>
  );
}
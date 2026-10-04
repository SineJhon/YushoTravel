import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { siteMeta } from "@/lib/seo";
import { ContactForm } from "@/components/requests/contact-form";
import { CONTACT_ADDRESS, CONTACT_CITY, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/constants";

export const metadata: Metadata = siteMeta({
  title: "Contact",
  description:
    "Contact Yusho Travel in Arba Minch — booking help, custom tours, events and student services. We reply within one business day.",
  path: "/contact",
});

const info = [
  { icon: <MapPin size={18} />, label: "Address", value: `${CONTACT_ADDRESS} · ${CONTACT_CITY}` },
  { icon: <Phone size={18} />, label: "Phone / WhatsApp", value: CONTACT_PHONE_DISPLAY, href: "tel:+251468812345" },
  { icon: <Mail size={18} />, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: <Clock3 size={18} />, label: "Office hours", value: "Mon–Sat · 8:30 AM – 6:30 PM" },
];

export default function ContactPage() {
  return (
    <div className="min-h-dvh pt-28 sm:pt-32">
      <div className="container-x pb-24">
        <p className="eyebrow">Contact Yusho</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
          Let's talk about your <span className="text-teal-700">journey</span>
        </h1>
        <p className="mt-3 max-w-2xl text-ink-500">
          Booking questions, custom tours, event ideas or student-arrival help — drop us a
          message and we'll reply quickly.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ContactForm />

          <div className="space-y-4">
            <div className="rounded-3xl border border-forest-900/10 bg-forest-950 p-6 text-sand-50 grain">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Yusho Travel</p>
              <ul className="mt-5 space-y-4 text-sm">
                {info.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400">{item.icon}</span>
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-sand-100/50">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="text-sand-100 hover:text-white">{item.value}</a>
                      ) : (
                        <span className="text-sand-100">{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl border border-ink-200/40 shadow-card">
              <iframe
                title="Map — Yusho Travel, Arba Minch"
                src="https://www.openstreetmap.org/export/embed.html?bbox=37.53%2C6.02%2C37.60%2C6.08&layer=mapnik&marker=6.0311%2C37.5666"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
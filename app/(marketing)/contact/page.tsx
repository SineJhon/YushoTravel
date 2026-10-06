import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteMeta } from "@/lib/seo";
import { ContactForm } from "@/components/requests/contact-form";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_2, CONTACT_PHONE_2_TEL, CONTACT_PHONE_TEL } from "@/lib/constants";

export const metadata: Metadata = siteMeta({
  title: "Contact",
  description:
    "Contact Yusho Travel in Arba Minch — booking help, custom tours, events and student services. We reply within one business day.",
  path: "/contact",
});

type InfoItem = {
  icon: ReactNode;
  label: string;
  value?: string;
  href?: string;
  links?: { label: string; href: string }[];
};

const info: InfoItem[] = [
  { icon: <MapPin size={18} />, label: "Address", value: CONTACT_ADDRESS },
  {
    icon: <Phone size={18} />,
    label: "Phone / WhatsApp",
    links: [
      { label: CONTACT_PHONE, href: `tel:${CONTACT_PHONE_TEL}` },
      { label: CONTACT_PHONE_2, href: `tel:${CONTACT_PHONE_2_TEL}` },
    ],
  },
  { icon: <Mail size={18} />, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
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
                      ) : item.links ? (
                        <span className="flex flex-col gap-0.5">
                          {item.links.map((l) => (
                            <a key={l.href} href={l.href} className="text-sand-100 hover:text-white">{l.label}</a>
                          ))}
                        </span>
                      ) : (
                        <span className="text-sand-100">{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
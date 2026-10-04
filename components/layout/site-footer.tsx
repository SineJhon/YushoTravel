import Link from "next/link";
import { Camera, Globe, Mail, MapPin, Phone, Send } from "lucide-react";
import { APP_NAME, AMHARIC_WORD, CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/constants";

const destinationLinks = [
  { label: "Forty Springs", href: "/destinations/forty-springs" },
  { label: "Lake Chamo", href: "/destinations/lake-chamo" },
  { label: "Dorze Village", href: "/destinations/dorze-village" },
  { label: "Crocodile Ranch", href: "/destinations/crocodile-ranch" },
  { label: "Dorsso Waterfall", href: "/destinations/dorsso-waterfall" },
];

const quickLinks = [
  { label: "All destinations", href: "/destinations" },
  { label: "Upcoming events", href: "/events" },
  { label: "Private tour request", href: "/private-tour" },
  { label: "Student services", href: "/student-services" },
  { label: "About Yusho", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-forest-950 text-sand-50 grain">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold">
            Yusho<span className="text-gold-400"> Travel</span>
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.28em] text-teal-300">
            {AMHARIC_WORD} · journey
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-100/70">
            A modern travel, tour, events and student-experience company born in Arba Minch,
            southern Ethiopia. Explore. Experience. Connect.
          </p>
          <div className="mt-5 flex gap-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-gold-400 hover:text-forest-950">
              <Globe size={17} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-gold-400 hover:text-forest-950">
              <Camera size={17} />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-gold-400 hover:text-forest-950">
              <Send size={17} />
            </a>
          </div>
        </div>

        <nav aria-label="Explore">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sand-100/75 transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular destinations">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Destinations</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {destinationLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sand-100/75 transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Find us</p>
          <ul className="mt-4 space-y-3 text-sm text-sand-100/75">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-300" />
              {CONTACT_ADDRESS}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-teal-300" />
              <a href="tel:+251468812345" className="hover:text-white">{CONTACT_PHONE_DISPLAY}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-teal-300" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a>
            </li>
          </ul>
          <Link href="/student-services" className="mt-5 inline-flex rounded-full border border-gold-400/40 px-4 py-2 text-xs font-semibold text-gold-200 transition-colors hover:bg-gold-400 hover:text-forest-950">
            New to Arba Minch? Student services →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-sand-100/50 sm:flex-row">
          <p>© {year} {APP_NAME}. Made with care in Arba Minch, Ethiopia.</p>
          <p className="max-w-md text-center sm:text-right">
            {APP_NAME} is an independent travel & student-support company — not an official university office.
          </p>
        </div>
      </div>
    </footer>
  );
}
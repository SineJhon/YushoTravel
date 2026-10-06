import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { APP_NAME, AMHARIC_WORD, CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_2, CONTACT_PHONE_2_TEL, CONTACT_PHONE_TEL } from "@/lib/constants";
import { InstagramIcon, TelegramIcon, TikTokIcon } from "@/components/ui/brand-icons";
import { Logo } from "@/components/ui/logo";

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

const socialLinkClass =
  "flex size-10 items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-gold-400 hover:text-forest-950";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-forest-950 text-sand-50 grain">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="size-12" />
            <p className="font-display text-2xl font-bold leading-none">
              Yusho<span className="text-gold-400"> Travel</span>
            </p>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.28em] text-teal-300">
            {AMHARIC_WORD} · journey
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-100/70">
            YUSHO is the Gamo word for journeying — going around, exploring, experiencing place.
            We&rsquo;re a young, local team in Arba Minch making that happen for travellers and
            students alike.
          </p>
          <div className="mt-5 flex gap-2">
            <Link href="/" aria-label="Yusho Travel website" className={socialLinkClass}>
              <Globe size={17} />
            </Link>
            <a href="https://www.instagram.com/yushotravel.et?stkn=MXJ1ZmtrN3F6NjNtbg==" target="_blank" rel="noreferrer" aria-label="Instagram" className={socialLinkClass}>
              <InstagramIcon size={17} />
            </a>
            <a href="https://www.tiktok.com/@yushotravel" target="_blank" rel="noreferrer" aria-label="TikTok" className={socialLinkClass}>
              <TikTokIcon size={17} />
            </a>
            <a href="https://t.me/yushotravel" target="_blank" rel="noreferrer" aria-label="Telegram" className={socialLinkClass}>
              <TelegramIcon size={17} />
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
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-teal-300" />
              <span className="flex flex-col gap-0.5">
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-white">{CONTACT_PHONE}</a>
                <a href={`tel:${CONTACT_PHONE_2_TEL}`} className="hover:text-white">{CONTACT_PHONE_2}</a>
              </span>
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
        </div>
      </div>
    </footer>
  );
}
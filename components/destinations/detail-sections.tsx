import Link from "next/link";
import { BadgeCheck, CalendarClock, Check, Clock, MapPin, Route, Users } from "lucide-react";
import { formatETB, splitList } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

export type PackageRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: string | null;
  minGroupSize: number | null;
  maxGroupSize: number | null;
  privateOnly: boolean;
};

export type DestinationBase = {
  slug: string;
  name: string;
  basePrice: number;
  duration: string;
  location: string;
  region: string | null;
  category: string;
  mapQuery: string | null;
  distanceKm?: string | null;
  travelTime?: string | null;
};

export function PackagesGrid({ destination, packages }: { destination: DestinationBase; packages: PackageRow[] }) {
  if (!packages.length) return null;
  return (
    <section className="mt-14">
      <div className="flex items-center gap-3">
        <span className="eyebrow">Tour packages</span>
        <span className="gold-rule" />
      </div>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">Pick your package</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {packages.map((pkg, i) => (
          <article
            key={pkg.id}
            className="flex flex-col rounded-card border border-ink-200/40 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal-700/30 hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">Package {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">{pkg.name}</h3>
              </div>
              {pkg.privateOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-bold text-gold-800">
                  <BadgeCheck size={12} /> Private
                </span>
              )}
            </div>
            {pkg.description && <p className="mt-2 text-sm text-ink-500">{pkg.description}</p>}
            <dl className="mt-4 space-y-1.5 text-[13px] text-ink-500">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-teal-700" /> {pkg.duration ?? destination.duration}
              </div>
              <div className="flex items-center gap-2">
                <Users size={13} className="text-teal-700" />
                {pkg.maxGroupSize ? `Up to ${pkg.maxGroupSize} people` : pkg.minGroupSize ? `${pkg.minGroupSize}+ people` : "Flexible group size"}
              </div>
            </dl>
            <p className="mt-4 font-display text-2xl font-bold text-forest-800">
              {formatETB(pkg.price)}
              <span className="ml-1 text-xs font-medium text-ink-400">per person</span>
            </p>
            <Link href={`/book?destination=${destination.slug}&package=${pkg.id}`} className={buttonClass(i === 1 ? "gold" : "primary", "md", "mt-5 w-full")}>
              Book this package
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-ink-400">
        Prices are per person and include group transport from Arba Minch. Private & family options adjust the rate.
      </p>
    </section>
  );
}

export function VisitInfoBlock({
  distanceKm,
  travelTime,
  vicinity,
  visitInfo,
}: {
  distanceKm: string | null;
  travelTime: string | null;
  vicinity: string | null;
  visitInfo: string | null;
}) {
  const notes = splitList(visitInfo);
  const hasFacts = Boolean(distanceKm || travelTime || vicinity);
  if (!hasFacts && notes.length === 0) return null;

  return (
    <div className="rounded-2xl border border-teal-700/20 bg-teal-50/50 p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
        <CalendarClock size={18} className="text-teal-700" /> Getting there & visit info
      </h3>
      {hasFacts && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {distanceKm && (
            <div className="rounded-xl bg-white p-3.5 shadow-sm">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                <Route size={14} className="text-teal-700" /> Distance
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">{distanceKm}</dd>
            </div>
          )}
          {travelTime && (
            <div className="rounded-xl bg-white p-3.5 shadow-sm">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                <Clock size={14} className="text-teal-700" /> Travel time
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">{travelTime}</dd>
            </div>
          )}
          {vicinity && (
            <div className="rounded-xl bg-white p-3.5 shadow-sm">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                <MapPin size={14} className="text-teal-700" /> Location
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">{vicinity}</dd>
            </div>
          )}
        </dl>
      )}
      {notes.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
              <BadgeCheck size={15} className="mt-0.5 shrink-0 text-teal-600" /> {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FactList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-ink-200/40 bg-sand-50 p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
        <Icon size={18} className="text-teal-700" /> {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
            <Check size={16} className="mt-0.5 shrink-0 text-teal-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
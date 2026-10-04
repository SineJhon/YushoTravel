import { BadgeCheck, Check, ListChecks, LocateFixed, MapPin, Mountain, Users, X } from "lucide-react";
import { formatETB } from "@/lib/utils";
import type { DestinationBase } from "./detail-sections";

export function IncludesTable({ included, excluded }: { included: string[]; excluded: string[] }) {
  if (!included.length && !excluded.length) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {included.length > 0 && (
        <div className="rounded-2xl border border-teal-700/20 bg-teal-50/50 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <Check size={18} className="text-teal-700" /> What's included
          </h3>
          <ul className="mt-4 space-y-2.5">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                <BadgeCheck size={15} className="mt-0.5 shrink-0 text-teal-600" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {excluded.length > 0 && (
        <div className="rounded-2xl border border-ink-200/40 bg-sand-50 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <X size={18} className="text-ink-400" /> Not included
          </h3>
          <ul className="mt-4 space-y-2.5">
            {excluded.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-500">
                <X size={15} className="mt-0.5 shrink-0 text-ink-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function MeetingInfoBlock({ meetingInfo, requirements }: { meetingInfo: string | null; requirements: string | null }) {
  if (!meetingInfo && !requirements) return null;
  return (
    <div className="rounded-2xl border border-ink-200/40 bg-forest-900 p-6 text-sand-50">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
        <LocateFixed size={18} className="text-gold-400" /> Meeting & arrival
      </h3>
      {meetingInfo && (
        <p className="mt-2 flex items-start gap-2 text-sm text-sand-100/85">
          <MapPin size={15} className="mt-0.5 shrink-0 text-teal-300" /> {meetingInfo}
        </p>
      )}
      {requirements && (
        <p className="mt-2 flex items-start gap-2 text-sm text-sand-100/85">
          <ListChecks size={15} className="mt-0.5 shrink-0 text-teal-300" /> {requirements}
        </p>
      )}
    </div>
  );
}

export function MapEmbed({ mapQuery, name }: { mapQuery: string | null; name: string }) {
  if (!mapQuery) return null;
  const q = encodeURIComponent(mapQuery);
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-ink-200/40 shadow-card">
      <iframe
        title={`Map of ${name}`}
        src={`https://www.openstreetmap.org/export/embed.html?query=${q}`}
        className="h-[380px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function QuickFacts({ destination }: { destination: DestinationBase }) {
  const facts = [
    { icon: <Mountain size={16} />, label: "Duration", value: destination.duration },
    { icon: <MapPin size={16} />, label: "Category", value: destination.category },
    { icon: <MapPin size={16} />, label: "Region", value: destination.region ?? destination.location },
    { icon: <Users size={16} />, label: "From", value: formatETB(destination.basePrice) },
  ];
  return (
    <div>
      <p className="eyebrow">At a glance</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-xl bg-sand-50 p-3.5">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              <span className="text-teal-700">{fact.icon}</span> {fact.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
"use client";

import { BadgeCheck, CalendarDays, PartyPopper, Users } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui/controls";
import { cn, formatETB } from "@/lib/utils";
import { ADD_ON_SERVICES, BOOKING_MODES } from "@/lib/constants";
import type { BookingDestination, BookingMode } from "./types";

export function StepDetails({
  destination,
  packageId,
  setPackageId,
  date,
  setDate,
  people,
  setPeople,
  mode,
  setMode,
  addOns,
  setAddOns,
  specialRequest,
  setSpecialRequest,
  todayISO,
}: {
  destination: BookingDestination;
  packageId: string;
  setPackageId: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  people: number;
  setPeople: (n: number) => void;
  mode: BookingMode;
  setMode: (m: BookingMode) => void;
  addOns: string[];
  setAddOns: (v: string[]) => void;
  specialRequest: string;
  setSpecialRequest: (v: string) => void;
  todayISO: string;
}) {
  const chosen = destination.packages.find((p) => p.id === packageId);
  const groupDisabled = !!chosen?.privateOnly;

  function toggleAddOn(id: string) {
    setAddOns(addOns.includes(id) ? addOns.filter((a) => a !== id) : [...addOns, id]);
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Details</h2>
      <p className="mt-1 text-sm text-ink-500">Pick a package, date and how you'd like to travel.</p>

      <p className="mt-6 text-[13px] font-bold text-ink-700">1. Tour package</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {destination.packages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPackageId(p.id)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition-all",
              p.id === packageId ? "border-teal-600 bg-teal-50/60" : "border-ink-200/50 hover:border-teal-700/40",
            )}
          >
            <p className="text-sm font-bold text-ink-900">{p.name}</p>
            <p className="mt-1 text-sm font-bold text-teal-800">
              {formatETB(p.price)} <span className="text-[11px] font-medium text-ink-400">/ person</span>
            </p>
            {p.privateOnly && <p className="mt-1 text-[11px] font-semibold text-gold-700">Private only</p>}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Travel date" htmlFor="date">
          <Input id="date" type="date" min={todayISO} value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
        <Field label="Number of people" htmlFor="people">
          <Input
            id="people"
            type="number"
            min={1}
            max={chosen?.maxGroupSize ?? 30}
            value={people}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
          />
        </Field>
      </div>

      <p className="mt-6 text-[13px] font-bold text-ink-700">2. How will you travel?</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {(Object.keys(BOOKING_MODES) as BookingMode[]).map((key) => {
          const opt = BOOKING_MODES[key];
          const disabled = key === "GROUP" && groupDisabled;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => setMode(key)}
              className={cn(
                "rounded-2xl border-2 p-4 text-left transition-all disabled:opacity-40",
                mode === key ? "border-gold-400 bg-gold-50/60" : "border-ink-200/50 hover:border-gold-400/60",
              )}
            >
              <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
                {key === "GROUP" ? (
                  <Users size={15} className="text-teal-700" />
                ) : key === "PRIVATE" ? (
                  <BadgeCheck size={15} className="text-gold-600" />
                ) : (
                  <PartyPopper size={15} className="text-teal-700" />
                )}
                {opt.label}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-500">{opt.hint}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] font-bold text-ink-700">3. Optional extras</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {ADD_ON_SERVICES.map((addOn) => (
          <button
            key={addOn.id}
            type="button"
            onClick={() => toggleAddOn(addOn.id)}
            className={cn(
              "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
              addOns.includes(addOn.id) ? "border-teal-600 bg-teal-50/60" : "border-ink-200/50 hover:border-teal-700/40",
            )}
          >
            <span>
              <span className="block text-sm font-semibold text-ink-900">{addOn.label}</span>
              <span className="block text-[11px] text-ink-500">{addOn.note}</span>
            </span>
            <span className="text-sm font-bold text-teal-800">+{formatETB(addOn.price)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Field label="Special request" htmlFor="special" optional>
          <Textarea
            id="special"
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="Allergies, accessibility, celebration plans…"
            className="min-h-20"
          />
        </Field>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink-500">
        <CalendarDays size={14} className="text-teal-700" />
        You can cancel while the booking is pending — no questions asked.
      </p>
    </div>
  );
}
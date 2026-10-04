"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { createBookingAction } from "@/lib/actions/bookings";
import { LazyImage } from "@/components/ui/lazy-image";
import { Button } from "@/components/ui/button";
import { cn, formatETB } from "@/lib/utils";
import { ADD_ON_SERVICES, BOOKING_MODES } from "@/lib/constants";
import { StepExperience } from "./step-experience";
import { StepDetails } from "./step-details";
import { StepReview } from "./step-review";
import { STEPS, type BookingDestination, type BookingMode } from "./types";

const MULTIPLIER: Record<BookingMode, number> = { GROUP: 1, PRIVATE: 1.5, FAMILY: 1.2 };

export function BookingWizard({
  destinations,
  user,
  initialDestination,
  initialPackage,
}: {
  destinations: BookingDestination[];
  user: { name: string; email: string; phone: string };
  initialDestination?: string;
  initialPackage?: string;
}) {
  const defaultDest = destinations.find((d) => d.slug === initialDestination) ?? destinations[0];
  const defaultPkg = defaultDest?.packages.find((p) => p.id === initialPackage) ?? defaultDest?.packages[0];

  const [step, setStep] = useState(0);
  const [destinationId, setDestinationId] = useState(defaultDest?.id ?? "");
  const [packageId, setPackageId] = useState(defaultPkg?.id ?? "");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const [mode, setMode] = useState<BookingMode>("GROUP");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [customer, setCustomer] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ bookingRef: string; totalPrice: number } | null>(null);

  const destination = destinations.find((d) => d.id === destinationId) ?? destinations[0];
  const pkg = destination?.packages.find((p) => p.id === packageId) ?? destination?.packages[0];

  const addOnsTotal = useMemo(
    () => addOns.reduce((sum, id) => sum + (ADD_ON_SERVICES.find((a) => a.id === id)?.price ?? 0), 0),
    [addOns],
  );
  const previewTotal = useMemo(() => {
    if (!pkg) return 0;
    return Math.round(pkg.price * people * MULTIPLIER[mode] + addOnsTotal);
  }, [pkg, people, mode, addOnsTotal]);

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  function canNext() {
    if (step === 0) return !!destination;
    if (step === 1) return !!pkg && !!date && !(pkg.privateOnly && mode === "GROUP");
    if (step === 2) {
      return customer.name.trim().length >= 2 && /^[+]?[0-9 ()-]{7,20}$/.test(customer.phone) && /.+@.+\..+/.test(customer.email);
    }
    return true;
  }

  async function submitBooking() {
    setBusy(true);
    const res = await createBookingAction({
      destinationId,
      packageId,
      date,
      numberOfPeople: people,
      mode,
      addOns,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      specialRequest,
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const data = res.data as { bookingRef: string; totalPrice: number };
    setResult({ bookingRef: data.bookingRef, totalPrice: data.totalPrice });
    setStep(3);
    toast.success("Booking submitted!");
  }
if (result) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="rounded-3xl border border-teal-700/20 bg-white p-8 shadow-card">
          <PartyPopper size={40} className="mx-auto text-gold-500" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink-900">Almost on the road!</h2>
          <p className="mt-2 text-ink-500">
            Your booking was submitted and is <b>pending our confirmation</b>. We usually confirm within 24 hours.
          </p>
          <dl className="mx-auto mt-6 max-w-sm space-y-3 rounded-2xl bg-sand-50 p-5 text-left">
            <ResultRow k="Booking reference" v={result.bookingRef} />
            <ResultRow k="Destination" v={destination?.name ?? ""} />
            <ResultRow k="Package" v={pkg?.name ?? ""} />
            <ResultRow k="Date" v={date} />
            <ResultRow k="Total" v={formatETB(result.totalPrice)} strong />
          </dl>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/account/bookings" className="rounded-full bg-forest-800 px-6 py-3 text-sm font-bold text-white hover:bg-forest-900">
              View my bookings
            </Link>
            <Link href="/destinations" className="rounded-full border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-sand-100">
              Keep exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <ol className="mb-8 flex items-center gap-2" aria-label="Booking progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    i < step ? "bg-teal-600 text-white" : i === step ? "bg-gold-400 text-forest-950" : "bg-ink-200/60 text-ink-500",
                  )}
                >
                  {i < step ? <CheckCircle2 size={15} /> : i + 1}
                </span>
                <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-ink-900" : "text-ink-400")}>{label}</span>
              </span>
              {i < STEPS.length - 1 && <span className={cn("mt-1.5 h-0.5 w-full rounded", i < step ? "bg-teal-600/60" : "bg-ink-200/60")} aria-hidden />}
            </li>
          ))}
        </ol>

        <div className="rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card sm:p-8">
          {step === 0 && (
            <StepExperience
              destinations={destinations}
              destinationId={destinationId}
              onSelect={(id) => {
                setDestinationId(id);
                setPackageId(destinations.find((d) => d.id === id)?.packages[0]?.id ?? "");
              }}
            />
          )}

          {step === 1 && destination && (
            <StepDetails
              destination={destination}
              packageId={packageId}
              setPackageId={setPackageId}
              date={date}
              setDate={setDate}
              people={people}
              setPeople={setPeople}
              mode={mode}
              setMode={setMode}
              addOns={addOns}
              setAddOns={setAddOns}
              specialRequest={specialRequest}
              setSpecialRequest={setSpecialRequest}
              todayISO={todayISO}
            />
          )}

          {step === 2 && (
            <StepReview
              destinationName={destination?.name ?? ""}
              packageName={pkg?.name ?? ""}
              modeLabel={BOOKING_MODES[mode]?.label ?? mode}
              date={date}
              people={people}
              addOnLabels={addOns.map((id) => ADD_ON_SERVICES.find((a) => a.id === id)?.label).filter(Boolean).join(", ")}
              specialRequest={specialRequest}
              customer={customer}
              setCustomer={setCustomer}
            />
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" size="md" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft size={16} /> Back
          </Button>
          {step < 2 ? (
            <Button variant="primary" size="md" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="gold" size="md" loading={busy} onClick={submitBooking} disabled={!canNext()}>
              <BadgeCheck size={17} /> Submit booking
            </Button>
          )}
        </div>
      </div>

<aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card">
          <p className="eyebrow">Summary</p>
          <div className="mt-3 flex items-start gap-3">
            <LazyImage src={destination?.cover ?? "/images/seed/hero-alt.webp"} alt={destination?.name ?? ""} boxClass="aspect-[4/3] w-20 rounded-lg" sizes="80px" />
            <div>
              <p className="font-display font-semibold text-ink-900">{destination?.name}</p>
              <p className="text-xs text-ink-500">{pkg?.name}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <SumRow k="Per person" v={pkg ? formatETB(pkg.price) : "—"} />
            <SumRow k="Travellers" v={String(people)} />
            <SumRow k="Mode" v={BOOKING_MODES[mode]?.label ?? mode} />
            {addOns.length > 0 && <SumRow k="Add-ons" v={formatETB(addOnsTotal)} />}
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-ink-200/40 pt-4">
            <span className="text-sm font-semibold text-ink-500">Estimated total</span>
            <span className="font-display text-2xl font-bold text-forest-800">{formatETB(previewTotal)}</span>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
            Final price is recalculated & confirmed securely on submit. Your booking stays pending until Yusho confirms it.
          </p>
        </div>
      </aside>
    </div>
  );
}

function ResultRow({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{k}</dt>
      <dd className={cn("text-right", strong ? "font-bold text-forest-800" : "font-semibold text-ink-900")}>{v}</dd>
    </div>
  );
}

function SumRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{k}</dt>
      <dd className="font-semibold text-ink-900">{v}</dd>
    </div>
  );
}
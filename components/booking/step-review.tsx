"use client";

import { Field, Input } from "@/components/ui/controls";

export function StepReview({
  destinationName,
  packageName,
  modeLabel,
  date,
  people,
  addOnLabels,
  specialRequest,
  customer,
  setCustomer,
}: {
  destinationName: string;
  packageName: string;
  modeLabel: string;
  date: string;
  people: number;
  addOnLabels: string;
  specialRequest: string;
  customer: { name: string; email: string; phone: string };
  setCustomer: (c: { name: string; email: string; phone: string }) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Review & your details</h2>
      <p className="mt-1 text-sm text-ink-500">Double-check everything, then submit.</p>

      <dl className="mt-6 space-y-2.5 rounded-2xl bg-sand-50 p-5 text-sm">
        <Row k="Destination" v={destinationName} />
        <Row k="Package" v={packageName} />
        <Row k="Mode" v={modeLabel} />
        <Row k="Date" v={date} />
        <Row k="Travellers" v={`${people} ${people === 1 ? "person" : "people"}`} />
        {addOnLabels && <Row k="Add-ons" v={addOnLabels} />}
        {specialRequest && <Row k="Request" v={specialRequest} />}
      </dl>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Lead traveller" htmlFor="cname">
          <Input id="cname" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} autoComplete="name" />
        </Field>
        <Field label="Phone" htmlFor="cphone">
          <Input id="cphone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} inputMode="tel" autoComplete="tel" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email" htmlFor="cemail">
            <Input id="cemail" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} type="email" autoComplete="email" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{k}</dt>
      <dd className="text-right font-semibold text-ink-900">{v}</dd>
    </div>
  );
}
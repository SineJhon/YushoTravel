"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { createPrivateTourAction } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/controls";
import { cn } from "@/lib/utils";
import { BUDGET_RANGES, TRANSPORT_PREFS } from "@/lib/constants";

type Option = { id: string; name: string };

export function PrivateTourForm({ destinations }: { destinations: Option[] }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", preferredDate: "", transportPreference: "", budgetRange: "", specialRequests: "", hotelRequired: false, foodRequired: false });
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function toggleDestination(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }
  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (selected.length === 0) return setError("Pick at least one destination.");
    setBusy(true);
    const res = await createPrivateTourAction({ ...form, numberOfPeople: 2, destinationIds: selected });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success("Request sent — we'll reply with a quotation.");
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-teal-700/20 bg-white p-10 text-center shadow-card">
        <CheckCircle2 size={44} className="mx-auto text-teal-600" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink-900">Request received!</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">We'll prepare a custom quotation and reach out within 24 hours.</p>
        <button onClick={() => setDone(false)} className="mt-6 text-sm font-bold text-teal-700 hover:underline">Send another</button>
      </div>
    );
  }

  const switchCls = (on: boolean) =>
    cn("flex items-center justify-between rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all", on ? "border-teal-600 bg-teal-50/60 text-ink-900" : "border-ink-200/60 text-ink-600");

  return (
    <form onSubmit={submit} className="rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card sm:p-8" noValidate>
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" autoComplete="name" /></Field>
        <Field label="Phone / WhatsApp"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+251 …" inputMode="tel" autoComplete="tel" /></Field>
        <div className="sm:col-span-2"><Field label="Email" optional><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></Field></div>
        <Field label="Preferred date" optional><Input type="date" value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} /></Field>
        <Field label="Budget range">
          <Select value={form.budgetRange} onChange={(e) => set("budgetRange", e.target.value)}>
            <option value="">Choose a rough range…</option>
            {BUDGET_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[13px] font-semibold text-ink-700">Destinations you'd love to visit <span className="font-normal text-ink-400">(one or more)</span></p>
        <div className="flex flex-wrap gap-2">
          {destinations.map((d) => {
            const active = selected.includes(d.id);
            return (
              <button key={d.id} type="button" onClick={() => toggleDestination(d.id)}
                className={cn("rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all", active ? "border-gold-400 bg-gold-50 text-gold-900" : "border-ink-200/60 text-ink-600 hover:border-teal-700/40")}
                aria-pressed={active}>
                {active && <CheckCircle2 size={13} className="mr-1 inline" />}
                {d.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <Field label="Transportation preference">
          <Select value={form.transportPreference} onChange={(e) => set("transportPreference", e.target.value)}>
            <option value="">Choose…</option>
            {TRANSPORT_PREFS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
      </div>
<div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="button" role="switch" aria-checked={form.hotelRequired} onClick={() => set("hotelRequired", !form.hotelRequired)} className={switchCls(form.hotelRequired)}>
          Hotel / accommodation needed <CheckCircle2 size={16} className={form.hotelRequired ? "text-teal-600" : "text-ink-200"} />
        </button>
        <button type="button" role="switch" aria-checked={form.foodRequired} onClick={() => set("foodRequired", !form.foodRequired)} className={switchCls(form.foodRequired)}>
          Food / meals included <CheckCircle2 size={16} className={form.foodRequired ? "text-teal-600" : "text-ink-200"} />
        </button>
      </div>

      <div className="mt-5">
        <Field label="Special requests" optional>
          <Textarea value={form.specialRequests} onChange={(e) => set("specialRequests", e.target.value)} placeholder="Anniversaries, photography, accessibility, dietary needs…" className="min-h-24" />
        </Field>
      </div>

      <Button type="submit" variant="gold" size="lg" loading={busy} className="mt-6 w-full">
        <Send size={16} /> Send my tour request
      </Button>
      <p className="mt-3 text-center text-[11px] text-ink-400">Free to request · no payment now · we reply with a custom quotation</p>
    </form>
  );
}
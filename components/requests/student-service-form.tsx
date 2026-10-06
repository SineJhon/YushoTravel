"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { createStudentServiceAction } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/controls";
import { cn } from "@/lib/utils";
import { ARRIVAL_LOCATIONS, STUDENT_PACKAGES } from "@/lib/constants";

export function StudentServiceForm({ initialPackage }: { initialPackage: string }) {
  const [form, setForm] = useState({
    package: initialPackage,
    fullName: "",
    phone: "",
    email: "",
    arrivingFrom: "",
    arrivalDate: "",
    arrivalLocation: "",
    goingTo: "",
    departureDate: "",
    numberOfFamilyMembers: "1",
    hotelRequired: false,
    tourRequired: false,
    registrationAssistance: false,
    dormitoryAssistance: false,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await createStudentServiceAction({
      ...form,
      numberOfFamilyMembers: Number(form.numberOfFamilyMembers) || 1,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success("Request received — a Yusho team member will contact you.");
    setDone(true);
  }

  if (done) {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 size={40} className="mx-auto text-teal-600" />
        <h3 className="mt-3 font-display text-xl font-bold text-ink-900">Request submitted!</h3>
        <p className="mt-1 text-sm text-ink-500">We'll call or message you within 24 hours with next steps.</p>
      </div>
    );
  }

  const toggleCls = (on: boolean) =>
    cn(
      "rounded-xl border-2 px-3 py-2.5 text-left text-[13px] font-semibold transition-all",
      on ? "border-teal-600 bg-teal-50/60 text-ink-900" : "border-ink-200/60 text-ink-600 hover:border-teal-700/40",
    );

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}

      <Field label="Package">
        <Select value={form.package} onChange={(e) => set("package", e.target.value)}>
          {STUDENT_PACKAGES.map((p) => (
            <option key={p.id} value={p.id}>{p.shortName}</option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student's full name">
          <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Phone / WhatsApp">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+251 …" inputMode="tel" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email" optional>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>
        <Field label="Number of family members travelling">
          <Input type="number" min={0} max={30} value={form.numberOfFamilyMembers} onChange={(e) => set("numberOfFamilyMembers", e.target.value)} />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">✈️ From — Arrival</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Arriving from" optional>
            <Input value={form.arrivingFrom} onChange={(e) => set("arrivingFrom", e.target.value)} placeholder="City, flight or bus — e.g. Addis Ababa, ET 122" />
          </Field>
          <Field label="Arrival date">
            <Input type="date" value={form.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} />
          </Field>
          <Field label="Arriving at">
            <Select value={form.arrivalLocation} onChange={(e) => set("arrivalLocation", e.target.value)}>
              <option value="">Choose…</option>
              {ARRIVAL_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </Select>
          </Field>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">🏁 To — Going</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Going to" optional>
            <Input value={form.goingTo} onChange={(e) => set("goingTo", e.target.value)} placeholder="Hotel, dormitory, campus, family house…" />
          </Field>
          <Field label="Departure date" optional>
            <Input type="date" value={form.departureDate} onChange={(e) => set("departureDate", e.target.value)} min={form.arrivalDate || undefined} />
          </Field>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">Which help do you need?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => set("hotelRequired", !form.hotelRequired)} className={toggleCls(form.hotelRequired)}>🏨 Hotel / accommodation arrangement</button>
          <button type="button" onClick={() => set("tourRequired", !form.tourRequired)} className={toggleCls(form.tourRequired)}>🏞️ Destination tour</button>
          <button type="button" onClick={() => set("registrationAssistance", !form.registrationAssistance)} className={toggleCls(form.registrationAssistance)}>📋 Registration-process guidance</button>
          <button type="button" onClick={() => set("dormitoryAssistance", !form.dormitoryAssistance)} className={toggleCls(form.dormitoryAssistance)}>🛏️ Dormitory-process guidance</button>
        </div>
      </div>

      <Field label="Notes" optional>
        <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Flight/bus number, dormitory, special needs, other questions…" className="min-h-20" />
      </Field>

      <Button type="submit" variant="gold" size="lg" loading={busy} className="w-full">
        <Send size={16} /> Submit request
      </Button>
    </form>
  );
}
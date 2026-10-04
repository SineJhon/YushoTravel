"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { createEventAction, updateEventAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/controls";
import { ImageManager } from "./image-manager";
import { EVENT_CATEGORIES } from "@/lib/constants";
import type { Prisma } from "@prisma/client";

type EventRow = Prisma.EventGetPayload<object>;
const isoDate = (d: Date | null | undefined) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function EventForm({ event, mode }: { event?: EventRow | null; mode: "create" | "edit" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: event?.title ?? "",
    slug: event?.slug ?? "",
    description: event?.description ?? "",
    category: event?.category ?? "social",
    date: event ? isoDate(event.date) : "",
    endDate: event?.endDate ? isoDate(event.endDate) : "",
    startTime: event?.startTime ?? "",
    location: event?.location ?? "",
    price: event ? String(event.price) : "",
    capacity: event ? String(event.capacity) : "",
    image: event?.image ?? "",
    organizer: event?.organizer ?? "",
    rules: event?.rules ?? "",
    status: event?.status ?? "UPCOMING",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      capacity: Number(form.capacity) || 1,
      gallery: "",
    };
    const res = mode === "create" ? await createEventAction(payload) : await updateEventAction(event!.id, payload);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success(res.message ?? "Saved");
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}

      <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Basics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Title"><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Dawn Cruise on Lake Chamo" /></Field>
          <Field label="Slug" optional><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="dawn-cruise-lake-chamo" /></Field>
          <div className="sm:col-span-2"><Field label="Description">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-24" />
          </Field></div>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {EVENT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
              {["UPCOMING", "PAST", "CANCELLED", "DRAFT"].map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">When & where</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="End date" optional><Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} /></Field>
          <Field label="Start time" optional><Input value={form.startTime} onChange={(e) => set("startTime", e.target.value)} placeholder="7:00 PM" /></Field>
          <Field label="Location"><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Arba Minch" /></Field>
          <Field label="Organizer" optional><Input value={form.organizer} onChange={(e) => set("organizer", e.target.value)} placeholder="Yusho Travel" /></Field>
          <Field label="Price (ETB)" hint="0 means free."><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
          <Field label="Capacity"><Input type="number" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Image & rules</h2>
        <div className="mt-4">
          <ImageManager compact images={form.image ? [form.image] : []} onChange={(urls) => set("image", urls[0] ?? "")} />
        </div>
        <div className="mt-4">
          <Field label="Rules / notes" optional>
            <Textarea value={form.rules} onChange={(e) => set("rules", e.target.value)} placeholder="One rule per line." />
          </Field>
        </div>
      </section>

      <Button type="submit" variant="primary" size="lg" loading={busy}>
        <Save size={16} /> {mode === "create" ? "Create event" : "Save changes"}
      </Button>
    </form>
  );
}
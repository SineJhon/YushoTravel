"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { createDestinationAction, updateDestinationAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/controls";
import { ImageManager } from "./image-manager";
import type { Prisma } from "@prisma/client";

type DestinationWithRelations = Prisma.DestinationGetPayload<{ include: { images: true; packages: true } }>;

export function DestinationForm({ destination, mode }: { destination?: DestinationWithRelations | null; mode: "create" | "edit" }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: destination?.name ?? "",
    slug: destination?.slug ?? "",
    tagline: destination?.tagline ?? "",
    description: destination?.description ?? "",
    location: destination?.location ?? "",
    region: destination?.region ?? "",
    duration: destination?.duration ?? "Full day",
    durationHours: destination?.durationHours ? String(destination.durationHours) : "",
    basePrice: destination ? String(destination.basePrice) : "",
    category: destination?.category ?? "Nature",
    highlights: destination?.highlights ? destination.highlights.split("|").join("\n") : "",
    thingsToDo: destination?.thingsToDo ? destination.thingsToDo.split("|").join("\n") : "",
    whatsIncluded: destination?.whatsIncluded ?? "",
    whatsExcluded: destination?.whatsExcluded ?? "",
    requirements: destination?.requirements ?? "",
    meetingInfo: destination?.meetingInfo ?? "",
    latitude: destination?.latitude ? String(destination.latitude) : "",
    longitude: destination?.longitude ? String(destination.longitude) : "",
    mapQuery: destination?.mapQuery ?? "",
    featured: destination?.featured ?? false,
    active: destination?.active ?? true,
    images: destination?.images.map((i) => i.imageUrl) ?? [],
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const pipeList = (value: string) => value.split("\n").map((s) => s.trim()).filter(Boolean).join("|");
    const payload = {
      name: form.name, slug: form.slug, tagline: form.tagline, description: form.description,
      location: form.location, region: form.region, duration: form.duration,
      durationHours: form.durationHours ? Number(form.durationHours) : undefined,
      basePrice: Number(form.basePrice) || 0, category: form.category,
      highlights: pipeList(form.highlights), thingsToDo: pipeList(form.thingsToDo),
      whatsIncluded: form.whatsIncluded, whatsExcluded: form.whatsExcluded,
      requirements: form.requirements, meetingInfo: form.meetingInfo,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      mapQuery: form.mapQuery, featured: form.featured, active: form.active, images: form.images,
    };
    const res = mode === "create" ? await createDestinationAction(payload) : await updateDestinationAction(destination!.id, payload);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success(res.message ?? "Saved");
    router.push("/admin/destinations");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}
<section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Identity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Forty Springs" /></Field>
          <Field label="Slug" optional><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="forty-springs" /></Field>
          <div className="sm:col-span-2"><Field label="Tagline (short)" optional>
            <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Short marketing line…" />
          </Field></div>
          <div className="sm:col-span-2"><Field label="Description">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-28" placeholder="A warm description for travellers…" />
          </Field></div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Location & pricing</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2"><Field label="Location text"><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. 40 km north of Arba Minch" /></Field></div>
          <Field label="Region (filter)"><Input value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Arba Minch" /></Field>
          <Field label="Duration text"><Input value={form.duration} onChange={(e) => set("duration", e.target.value)} /></Field>
          <Field label="Duration (hours)" optional><Input type="number" value={form.durationHours} onChange={(e) => set("durationHours", e.target.value)} /></Field>
          <Field label="Base price (ETB)"><Input type="number" value={form.basePrice} onChange={(e) => set("basePrice", e.target.value)} /></Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {["Nature", "Wildlife", "Cultural", "Adventure", "Lake"].map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Images</h2>
        <p className="mt-1 text-xs text-ink-400">First image is the cover. Upload or paste URLs.</p>
        <div className="mt-4">
          <ImageManager images={form.images} onChange={(images) => set("images", images)} />
        </div>
      </section>
<section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Content lists</h2>
        <p className="mt-1 text-xs text-ink-400">One item per line.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Highlights">
            <Textarea value={form.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"Swim in the springs\nBirdwatching"} />
          </Field>
          <Field label="Things to do">
            <Textarea value={form.thingsToDo} onChange={(e) => set("thingsToDo", e.target.value)} placeholder={"Walk the trail\nTry local coffee"} />
          </Field>
          <Field label="What's included" optional>
            <Textarea value={form.whatsIncluded} onChange={(e) => set("whatsIncluded", e.target.value)} />
          </Field>
          <Field label="What's not included" optional>
            <Textarea value={form.whatsExcluded} onChange={(e) => set("whatsExcluded", e.target.value)} />
          </Field>
          <Field label="Requirements" optional>
            <Textarea value={form.requirements} onChange={(e) => set("requirements", e.target.value)} className="min-h-16" />
          </Field>
          <Field label="Meeting schedule & pickup info" optional>
            <Textarea value={form.meetingInfo} onChange={(e) => set("meetingInfo", e.target.value)} className="min-h-16" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Map & status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Latitude" optional><Input value={form.latitude} onChange={(e) => set("latitude", e.target.value)} placeholder="6.2957" /></Field>
          <Field label="Longitude" optional><Input value={form.longitude} onChange={(e) => set("longitude", e.target.value)} placeholder="37.4378" /></Field>
          <Field label="Map search text" optional>
            <Input value={form.mapQuery} onChange={(e) => set("mapQuery", e.target.value)} placeholder="forty springs, Ethiopia" />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-teal-600" /> Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="size-4 accent-teal-600" /> Active / bookable
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="lg" loading={busy}>
          <Save size={16} /> {mode === "create" ? "Create destination" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
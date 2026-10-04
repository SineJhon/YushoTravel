"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { createTourPackageAction, updateTourPackageAction, deleteTourPackageAction } from "@/lib/actions/admin";
import { toastResult } from "./toast-result";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";
import { cn, formatETB } from "@/lib/utils";

type Pkg = { id: string; name: string; price: number; duration: string | null; privateOnly: boolean; active: boolean };
const empty = { name: "", price: "", duration: "", privateOnly: false, active: true };

export function PackageManager({ destinationId, packages }: { destinationId: string; packages: Pkg[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [busy, setBusy] = useState(false);

  function startAdd() { setForm({ ...empty }); setEditing(null); setOpen(true); }
  function startEdit(pkg: Pkg) {
    setForm({ name: pkg.name, price: String(pkg.price), duration: pkg.duration ?? "", privateOnly: pkg.privateOnly, active: pkg.active });
    setEditing(pkg);
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = { name: form.name, price: Number(form.price) || 0, duration: form.duration, privateOnly: form.privateOnly, active: form.active };
    const res = editing ? await updateTourPackageAction(editing.id, payload) : await createTourPackageAction(destinationId, payload);
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(res.message ?? "Saved");
    setOpen(false);
    window.location.reload();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this package?")) return;
    const res = await deleteTourPackageAction(id);
    toastResult(res, "Deleted");
    window.location.reload();
  }

  return (
    <section className="rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-900">Tour packages</h2>
        <button onClick={startAdd} className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700">
          <Plus size={14} /> Add package
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className={cn("flex items-center justify-between gap-3 rounded-xl border px-4 py-3", pkg.active ? "border-ink-200/60 bg-sand-50" : "border-ink-200/30 bg-sand-100 opacity-60")}>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">
                {pkg.name}
                {pkg.privateOnly && <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-800">private</span>}
                {!pkg.active && <span className="ml-2 rounded-full bg-ink-200/70 px-2 py-0.5 text-[10px] font-bold text-ink-500">inactive</span>}
              </p>
              <p className="text-xs text-ink-500">{formatETB(pkg.price)} {pkg.duration ? `· ${pkg.duration}` : ""}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button onClick={() => startEdit(pkg)} aria-label={`Edit ${pkg.name}`} className="flex size-8 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-white"><Pencil size={13} /></button>
              <button onClick={() => remove(pkg.id)} aria-label={`Delete ${pkg.name}`} className="flex size-8 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {packages.length === 0 && <p className="py-4 text-center text-sm text-ink-400">No packages yet.</p>}
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl bg-sand-100 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold text-ink-900">{editing ? "Edit package" : "New package"}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex size-7 items-center justify-center rounded-full bg-ink-200/60 text-ink-700"><X size={14} /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Price (ETB)"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
            <Field label="Duration" optional><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Full day" /></Field>
          </div>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <input type="checkbox" checked={form.privateOnly} onChange={(e) => setForm({ ...form, privateOnly: e.target.checked })} className="size-4 accent-gold-500" /> Private only
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="size-4 accent-teal-600" /> Active
            </label>
          </div>
          <Button type="submit" variant="primary" size="md" loading={busy}><Plus size={15} /> Save package</Button>
        </form>
      )}
    </section>
  );
}
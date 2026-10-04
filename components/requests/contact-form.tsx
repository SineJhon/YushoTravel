"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { createContactAction } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/controls";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await createContactAction(form);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success("Message sent — we usually reply within one business day.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card sm:p-8" noValidate>
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" autoComplete="name" />
        </Field>
        <Field label="Phone (optional)">
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251 …" inputMode="tel" autoComplete="tel" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Subject" optional>
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Booking help, event idea, partnership…" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Message">
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need…" className="min-h-32" />
          </Field>
        </div>
      </div>
      <Button type="submit" variant="primary" size="lg" loading={busy} className="mt-6 w-full">
        <Send size={16} /> Send message
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
        <CheckCircle2 size={13} className="text-teal-600" /> We reply within one business day
      </p>
    </form>
  );
}
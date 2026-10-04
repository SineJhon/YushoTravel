"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-ink-400">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await registerAction(form);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success(res.message ?? "Account created!");
    router.push(next && next.startsWith("/") ? next : "/account");
    router.refresh();
  }

  return (
    <>
      <p className="eyebrow">Join Yusho</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Create your account</h1>
      <p className="mt-2 text-sm text-ink-500">
        Book tours, grab event seats and track every request.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </div>
        )}
        <Field label="Full name" htmlFor="name">
          <Input
            id="name"
            autoComplete="name"
            required
            placeholder="Selam T."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email address" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" loading={busy} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-teal-700 hover:text-teal-800">
          Sign in
        </Link>
      </p>
    </>
  );
}
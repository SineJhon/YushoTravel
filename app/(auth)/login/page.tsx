"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-ink-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await loginAction(form);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success("Welcome back!");
    const target = next && next.startsWith("/") ? next : res.admin ? "/admin" : "/account";
    router.push(target);
    router.refresh();
  }

  return (
    <>
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Sign in</h1>
      <p className="mt-2 text-sm text-ink-500">
        Manage bookings, reviews and requests — all in one place.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </div>
        )}
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
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" size="lg" loading={busy} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        New to Yusho?{" "}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-teal-700 hover:text-teal-800">
          Create an account
        </Link>
      </p>
      <p className="mt-4 rounded-xl bg-sand-100 px-4 py-3 text-xs leading-relaxed text-ink-500">
        <b>Demo accounts (seeded):</b> admin@yusho.travel / Yusho@Admin2026 · demo.yusho@example.com / Demo@2026
      </p>
    </>
  );
}
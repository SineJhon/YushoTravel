"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { confirmPasswordResetAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-ink-400">Loading…</div>}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<boolean>(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    const res = await confirmPasswordResetAction({ token, password });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success(res.message ?? "Password reset!");
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-900">All set 🎉</h1>
        <p className="mt-2 text-sm text-ink-500">Your password has been reset. Time to plan that journey.</p>
        <Link href="/login" className="mt-6 inline-block rounded-full bg-forest-800 px-6 py-3 text-sm font-bold text-white hover:bg-forest-900">
          Sign in
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Invalid link</h1>
        <p className="mt-2 text-sm text-ink-500">This reset link is missing or invalid. Request a new one.</p>
        <Link href="/forgot-password" className="mt-6 inline-block rounded-full bg-forest-800 px-6 py-3 text-sm font-bold text-white hover:bg-forest-900">
          Request a new link
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="eyebrow">Reset password</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Choose a new password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </div>
        )}
        <Field label="New password" htmlFor="password" hint="At least 8 characters.">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm new password" htmlFor="confirm">
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" loading={busy} className="w-full">
          Reset password
        </Button>
      </form>
    </>
  );
}
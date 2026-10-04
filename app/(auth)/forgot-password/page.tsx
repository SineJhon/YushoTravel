"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { requestPasswordResetAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setDevUrl(null);
    setBusy(true);
    const res = await requestPasswordResetAction({ email });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage(res.message ?? "Reset link sent.");
    const data = res.data as { devResetUrl?: string } | undefined;
    if (data?.devResetUrl) setDevUrl(data.devResetUrl);
  }

  return (
    <>
      <p className="eyebrow">Reset password</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Forgot your password?</h1>
      <p className="mt-2 text-sm text-ink-500">
        Enter your account email and we'll send you a reset link.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status">
            {message}
          </div>
        )}
        {devUrl && (
          <div className="rounded-xl border border-gold-300 bg-gold-50 p-4 text-sm">
            <p className="font-bold text-gold-900">Development mode reset link</p>
            <p className="mt-1 break-all text-xs text-gold-800">{devUrl}</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(devUrl);
                toast.success("Link copied");
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-gold-900 hover:underline"
            >
              <Copy size={13} /> Copy link
            </button>
            <a href={devUrl} className="ml-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold-900 hover:underline">
              <ExternalLink size={13} /> Open
            </a>
          </div>
        )}
        <Field label="Email address" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" loading={busy} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-teal-700 hover:text-teal-800">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
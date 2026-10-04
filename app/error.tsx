"use client";

import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-bold text-gold-500">Oops</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink-900">We hit a bump on the road</h1>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        {error.message || "Something went wrong loading this page. Try again — or reach out and we'll sort it."}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-bold text-white hover:bg-forest-900"
      >
        <RefreshCw size={15} /> Try again
      </button>
    </div>
  );
}
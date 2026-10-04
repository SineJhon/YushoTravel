"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { createReviewAction } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/controls";
import { RatingInput } from "@/components/ui/star-rating";

export function ReviewForm({
  bookingId,
  eventId,
  onSubmitted,
}: {
  bookingId?: string;
  eventId?: string;
  onSubmitted?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError("Choose 1–5 stars.");
      return;
    }
    setBusy(true);
    const res = await createReviewAction({ bookingId, eventId, rating, comment });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast.success(res.message ?? "Review submitted!");
    setRating(0);
    setComment("");
    onSubmitted?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}
      <div>
        <p className="mb-1.5 text-[13px] font-semibold text-ink-700">Your rating</p>
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <Field label="Your review">
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the experience? Guides, scenery, organisation…" />
      </Field>
      <Button type="submit" variant="primary" size="md" loading={busy}>
        <Send size={15} /> Submit review
      </Button>
      <p className="text-[11px] text-ink-400">Reviews are published once approved by the Yusho team.</p>
    </form>
  );
}
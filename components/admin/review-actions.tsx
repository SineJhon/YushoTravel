"use client";

import { useRouter } from "next/navigation";
import { Check, EyeOff, Star, Trash2 } from "lucide-react";
import { moderateReviewAction } from "@/lib/actions/admin-ops";
import { toastResult } from "./toast-result";

export function ReviewActions({ reviewId, approved, featured }: { reviewId: string; approved: boolean; featured: boolean }) {
  const router = useRouter();
  const btn =
    "flex size-9 items-center justify-center rounded-full border transition-colors";

  async function run(action: "approve" | "hide" | "delete" | "feature" | "unfeature") {
    const res = await moderateReviewAction({ reviewId, action });
    toastResult(res);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {!approved && (
        <button onClick={() => run("approve")} className={`${btn} border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100`} aria-label="Approve" title="Approve">
          <Check size={14} />
        </button>
      )}
      {approved && !featured && (
        <button onClick={() => run("feature")} className={`${btn} border-gold-300 bg-gold-50 text-gold-700 hover:bg-gold-100`} aria-label="Feature" title="Feature on homepage">
          <Star size={14} />
        </button>
      )}
      {featured && (
        <button onClick={() => run("unfeature")} className={`${btn} border-ink-200 text-ink-500 hover:bg-sand-100`} aria-label="Unfeature" title="Remove from featured">
          <Star size={14} className="fill-gold-500 text-gold-500" />
        </button>
      )}
      {approved && (
        <button onClick={() => run("hide")} className={`${btn} border-ink-200 text-ink-500 hover:bg-sand-100`} aria-label="Hide" title="Hide">
          <EyeOff size={14} />
        </button>
      )}
      <button onClick={() => run("delete")} className={`${btn} border-red-200 text-red-600 hover:bg-red-50`} aria-label="Delete" title="Delete review">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
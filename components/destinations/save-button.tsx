"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleSaveDestinationAction } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

export function SaveButton({
  destinationId,
  initialSaved = false,
  showLabel = true,
  className,
}: {
  destinationId: string;
  initialSaved?: boolean;
  showLabel?: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const res = await toggleSaveDestinationAction({ destinationId });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setSaved(!!res.saved);
    toast.success(res.message);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
        saved
          ? "border-gold-400 bg-gold-50 text-gold-800"
          : "border-ink-200/60 bg-white text-ink-700 hover:border-gold-400 hover:text-gold-700",
        className,
      )}
      aria-pressed={saved}
    >
      <Heart size={16} className={cn(saved && "fill-gold-500 text-gold-500")} />
      {showLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cancelBookingAction, cancelEventBookingAction } from "@/lib/actions/bookings";

export function CancelBookingButton({
  bookingId,
  type = "tour",
  className,
}: {
  bookingId: string;
  type?: "tour" | "event";
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!window.confirm("Cancel this booking? This can't be undone.")) return;
    setBusy(true);
    const res =
      type === "tour"
        ? await cancelBookingAction({ bookingId })
        : await cancelEventBookingAction({ bookingId });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Booking cancelled.");
    router.refresh();
  }

  return (
    <button
      onClick={cancel}
      disabled={busy}
      className={
        className ??
        "rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
      }
    >
      {busy ? "Cancelling…" : "Cancel booking"}
    </button>
  );
}
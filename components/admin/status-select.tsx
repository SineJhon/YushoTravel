"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBookingStatusAction, updateEventBookingStatusAction } from "@/lib/actions/admin-ops";

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"] as const;

export function BookingStatusSelect({ bookingId, current, type }: { bookingId: string; current: string; type: "tour" | "event" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(status: string) {
    setBusy(true);
    const res =
      type === "tour"
        ? await updateBookingStatusAction({ bookingId, status })
        : await updateEventBookingStatusAction({ bookingId, status });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Updated");
    router.refresh();
  }

  return (
    <div className="relative inline-block">
      <span className="sr-only">Booking status</span>
      <select
        value={current}
        disabled={busy}
        onChange={(e) => change(e.target.value)}
        className="cursor-pointer rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 focus:outline-none focus:ring-2 focus:ring-teal-600/40 disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
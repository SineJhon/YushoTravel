"use client";

import { useState } from "react";
import { CheckCircle2, Minus, Plus, Ticket } from "lucide-react";
import { toast } from "sonner";
import { createEventBookingAction } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";
import { formatETB } from "@/lib/utils";

export function EventBookingPanel({
  eventId,
  price,
  availableSeats,
}: {
  eventId: string;
  price: number;
  availableSeats: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const max = Math.min(availableSeats, 20);
  const total = price * quantity;

  async function submit() {
    setBusy(true);
    const res = await createEventBookingAction({
      eventId,
      quantity,
      attendeeName: name,
      attendeePhone: phone,
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setReference(String((res.data as { reference?: string } | undefined)?.reference ?? ""));
    toast.success(res.message);
  }

  if (reference) {
    return (
      <div className="rounded-2xl border border-teal-700/25 bg-teal-50 p-6 text-center">
        <CheckCircle2 size={34} className="mx-auto text-teal-600" />
        <h3 className="mt-3 font-display text-xl font-bold text-ink-900">Seats requested!</h3>
        <p className="mt-1 text-sm text-ink-600">Reference: <span className="font-bold">{reference}</span></p>
        <p className="mt-2 text-sm text-ink-500">
          We'll confirm your seats shortly. Track this booking in your account.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-200/40 bg-white p-6 shadow-card">
      <p className="eyebrow">Seat</p>
      <p className="mt-2 font-display text-3xl font-bold text-forest-800">
        {price === 0 ? "Free" : formatETB(price)}
        <span className="text-sm font-medium text-ink-400"> / person</span>
      </p>

      <div className="mt-5">
        <p className="mb-1.5 text-[13px] font-semibold text-ink-700">How many seats?</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || availableSeats === 0}
            aria-label="Fewer seats"
            className="flex size-11 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:bg-sand-100 disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
          <span className="flex h-11 min-w-16 items-center justify-center rounded-full bg-sand-100 font-bold text-ink-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max || availableSeats === 0}
            aria-label="More seats"
            className="flex size-11 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:bg-sand-100 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-semibold text-ink-700">
            <Ticket size={13} className="text-teal-700" /> {availableSeats} left
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Field label="Lead attendee name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
          />
        </Field>
        <Field label="Phone number">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 …"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink-200/40 pt-4">
        <span className="text-sm text-ink-500">
          Total for <b>{quantity}</b> {quantity === 1 ? "person" : "people"}
        </span>
        <span className="font-display text-xl font-bold text-forest-800">{price === 0 ? "Free" : formatETB(total)}</span>
      </div>

      <Button onClick={submit} loading={busy} variant="gold" size="lg" className="mt-4 w-full" disabled={availableSeats === 0}>
        {availableSeats === 0 ? "Sold out" : "Book seats"}
      </Button>
      <p className="mt-3 text-center text-[11px] text-ink-400">
        You'll need to be signed in. Seats are held once your request is confirmed.
      </p>
    </div>
  );
}
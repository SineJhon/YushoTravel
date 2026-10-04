"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStudentServiceStatusAction, updatePrivateTourStatusAction } from "@/lib/actions/admin-ops";
import { toastResult } from "./toast-result";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/controls";

const STUDENT_STATUSES = ["PENDING", "CONTACTED", "IN_PROGRESS", "DONE", "DECLINED"];
const PRIVATE_STATUSES = ["PENDING", "QUOTED", "CONFIRMED", "DECLINED"];

export function StudentRequestAction({ id, current }: { id: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const res = await updateStudentServiceStatusAction({ id, status, adminResponse: response || undefined });
    setBusy(false);
    toastResult(res);
    router.refresh();
    setResponse("");
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      className="mt-4 space-y-2 rounded-2xl bg-sand-100 p-4"
    >
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STUDENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Button type="submit" size="sm" loading={busy}>Update</Button>
      </div>
      <Field label="Reply note (shown to the customer)" optional>
        <Textarea value={response} onChange={(e) => setResponse(e.target.value)} className="min-h-16" />
      </Field>
    </form>
  );
}

export function PrivateRequestAction({ id, current, quotation }: { id: string; current: string; quotation: number | null }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [quote, setQuote] = useState(quotation ? String(quotation) : "");
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const res = await updatePrivateTourStatusAction({
      id,
      status,
      quotation: quote ? Number(quote) : null,
      adminResponse: response || undefined,
    });
    setBusy(false);
    toastResult(res);
    router.refresh();
    setResponse("");
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-4 space-y-2 rounded-2xl bg-sand-100 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {PRIVATE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Quotation (ETB)" optional>
          <Input type="number" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="12000" className="w-36" />
        </Field>
        <Button type="submit" size="sm" loading={busy}>Update</Button>
      </div>
      <Field label="Reply note (shown to the customer)" optional>
        <Textarea value={response} onChange={(e) => setResponse(e.target.value)} className="min-h-16" />
      </Field>
    </form>
  );
}
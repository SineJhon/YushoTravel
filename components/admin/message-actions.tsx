"use client";

import { useRouter } from "next/navigation";
import { Check, Trash2 } from "lucide-react";
import { setMessageStatusAction, deleteMessageAction } from "@/lib/actions/admin-ops";
import { toastResult } from "./toast-result";

export function MessageActions({ messageId, status }: { messageId: string; status: string }) {
  const router = useRouter();
  const btn = "flex size-8 items-center justify-center rounded-full border transition-colors";

  async function setStatus(next: "READ" | "HANDLED") {
    const res = await setMessageStatusAction({ messageId, status: next });
    toastResult(res);
    router.refresh();
  }
  async function remove() {
    if (!window.confirm("Delete this message?")) return;
    const res = await deleteMessageAction({ messageId });
    toastResult(res, "Deleted");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5">
      {status !== "HANDLED" && (
        <button onClick={() => setStatus("HANDLED")} className={`${btn} border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100`} aria-label="Mark handled" title="Mark handled">
          <Check size={13} />
        </button>
      )}
      {status === "HANDLED" && (
        <button onClick={() => setStatus("READ")} className={`${btn} border-ink-200 text-ink-500 hover:bg-sand-100`} aria-label="Reopen" title="Mark unhandled">
          <Check size={13} />
        </button>
      )}
      <button onClick={remove} className={`${btn} border-red-200 text-red-600 hover:bg-red-50`} aria-label="Delete" title="Delete message">
        <Trash2 size={13} />
      </button>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserRoleAction } from "@/lib/actions/admin-ops";
import { toastResult } from "./toast-result";

export function RoleSelect({ userId, role }: { userId: string; role: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(value: string) {
    setBusy(true);
    const res = await setUserRoleAction({ userId, role: value });
    setBusy(false);
    toastResult(res);
    router.refresh();
  }

  return (
    <select
      value={role}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      className="cursor-pointer rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 focus:outline-none focus:ring-2 focus:ring-teal-600/40"
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
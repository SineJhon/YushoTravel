"use client";

import { toast } from "sonner";
import type { ActionRes } from "@/lib/actions/helpers";

export function toastResult(res: ActionRes, fallback = "Done") {
  if (res.ok) toast.success(res.message ?? fallback);
  else toast.error(res.error);
}
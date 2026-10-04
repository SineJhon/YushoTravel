export type ActionRes =
  | { ok: true; message?: string; data?: unknown }
  | { ok: false; error: string };

export function firstError(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Your input is invalid.";
}
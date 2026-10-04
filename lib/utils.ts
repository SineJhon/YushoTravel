import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an amount as Ethiopian Birr. */
export function formatETB(amount: number, opts?: Intl.NumberFormatOptions) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: "ETB",
      maximumFractionDigits: 0,
      ...opts,
    }).format(amount);
  } catch {
    return `ETB ${Number(amount || 0).toLocaleString("en")}`;
  }
}

export function formatCompactETB(amount: number) {
  return formatETB(amount);
}

/** 4 Oct 2026 */
export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** 4 Oct 2026 · 9:00 AM */
export function formatDateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Oct 2026 */
export function formatMonthYear(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
}

/** Human friendly relative time. */
export function timeAgo(input: Date | string) {
  const date = typeof input === "string" ? new Date(input) : input;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/** URL-friendly slug. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
/** Human friendly booking reference like YS-2026-X7F2K9. */
export function generateRef(prefix = "YS") {
  const year = new Date().getFullYear();
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${year}-${code}`;
}

/** Smart JSON parse for string columns. */
export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** "|"-separated text list → trimmed string array. */
export function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function isFutureDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.getTime() > Date.now();
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function todayString() {
  return new Date().toISOString().slice(0, 10);
}
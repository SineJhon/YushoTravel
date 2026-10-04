/** Shared helpers for the seed script. */

export function daysFromNow(days: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export function img(name: string) {
  return `/images/seed/${name}.webp`;
}

export const DEMO_EMAIL = "demo.yusho@example.com";
export const DEMO_PASSWORD = "Demo@2026";
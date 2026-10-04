/** Simple in-memory sliding-window rate limiter (per process).
 *  Suitable for dev/small deployments. For horizontal scaling replace with a
 *  shared store (Redis/Upstash). */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 15, windowMs = 60_000) {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const };
  }
  if (bucket.count >= limit) {
    return { ok: false as const, retryAfterMs: bucket.resetAt - now };
  }
  bucket.count += 1;
  return { ok: true as const };
}

/** Build a stable key from an IP address + route name. */
export function ipKey(ip: string | undefined | null, route: string) {
  return `${ip ?? "unknown"}:${route}`;
}

export function clientAddress(xForwardedFor?: string | null) {
  if (!xForwardedFor) return undefined;
  return xForwardedFor.split(",")[0]?.trim() || undefined;
}

// Best-effort cleanup so the map doesn't grow forever.
const CLEANUP_INTERVAL = 10 * 60_000;
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (now >= bucket.resetAt) store.delete(key);
    }
  }, CLEANUP_INTERVAL);
  // Don't keep the Node process alive because of the timer.
  if (typeof (setInterval as unknown as { unref?: () => void }).unref === "function") {
    (setInterval as unknown as { unref: () => void }).unref();
  }
}
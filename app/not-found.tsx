import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-forest-950 px-6 text-center text-sand-50 grain">
      <Compass size={44} className="animate-float text-gold-400" />
      <p className="mt-6 font-display text-7xl font-bold text-gold-400">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">This trail doesn't exist… yet.</h1>
      <p className="mt-3 max-w-md text-sand-100/70">
        The page you're looking for may have moved, or never been mapped. Let's get you back on the road.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-bold text-forest-950 hover:bg-gold-300">
          <Home size={16} /> Back home
        </Link>
        <Link href="/destinations" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
          <Compass size={16} /> Explore destinations
        </Link>
      </div>
    </div>
  );
}
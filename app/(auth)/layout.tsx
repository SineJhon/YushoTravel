import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-forest-950 px-4 py-10 grain">
      <div className="absolute -left-32 top-8 size-96 rounded-full bg-teal-500/15 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-gold-400/15 blur-3xl" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mx-auto flex w-fit flex-col items-center gap-1">
          <Logo className="size-16 rounded-2xl" />
          <span className="font-display text-xl font-bold text-white">
            Yusho<span className="text-gold-400"> Travel</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-sand-100/60">
            ዙረት · journey
          </span>
        </Link>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white p-6 shadow-pop sm:p-8">
          {children}
        </div>
        <p className="mt-4 text-center text-xs text-sand-100/50">
          <ImageIcon size={12} className="mr-1 inline" />
          Exploring Arba Minch · southern Ethiopia
        </p>
      </div>
    </div>
  );
}
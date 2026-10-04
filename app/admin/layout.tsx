import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/account");

  const showDemoBadge = process.env.NEXT_PUBLIC_SHOW_DEMO_BADGE !== "false";

  return (
    <div className="min-h-dvh bg-sand-100">
      <header className="sticky top-0 z-40 border-b border-ink-200/40 bg-white/90 backdrop-blur">
        <div className="container-x flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-forest-950 font-display text-lg font-bold text-gold-400">Y</span>
            <div>
              <p className="font-display text-lg font-bold leading-tight text-ink-900">Yusho Admin</p>
              <p className="text-[11px] font-medium text-ink-400">Signed in as {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showDemoBadge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[11px] font-bold text-gold-900">
                <ShieldCheck size={12} /> Development seed data — replace before launch
              </span>
            )}
            <Link href="/" className="hidden rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100 sm:inline-flex">
              View site
            </Link>
          </div>
        </div>
      </header>

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
        <AdminNav />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
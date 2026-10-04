import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import { AccountTabs } from "@/components/account/account-tabs";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1 bg-sand-50 pt-24 sm:pt-28">
        <div className="container-x pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar src={user.profileImage} name={user.name} size={56} />
              <div>
                <h1 className="font-display text-3xl font-semibold text-ink-900">{user.name}</h1>
                <p className="text-sm text-ink-500">{user.email}</p>
              </div>
            </div>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-forest-900">
                <UserRound size={15} /> Open admin dashboard
              </Link>
            )}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
            <AccountTabs />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
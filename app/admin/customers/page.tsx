import type { Metadata } from "next";
import { getAdminCustomers } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { RoleSelect } from "@/components/admin/role-select";
import { SearchForm } from "@/components/admin/search-input";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = siteMeta({ title: "Customers", description: "Manage Yusho customers.", path: "/admin/customers", noindex: true });

type SP = { [key: string]: string | undefined };

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const { rows, total } = await getAdminCustomers(search);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Customers</h1>
      <p className="mt-1 text-sm text-ink-500">{total} accounts.</p>

      <div className="mt-5 max-w-sm">
        <SearchForm action="/admin/customers" defaultValue={search} placeholder="Search name, email, phone…" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-200/40 bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200/40 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id} className="border-b border-ink-200/30 last:border-0 hover:bg-sand-50">
                <td className="px-4 py-3 font-semibold text-ink-900">{user.name}</td>
                <td className="px-4 py-3">
                  {user.email}
                  {user.phone && <span className="block text-xs font-normal text-ink-400">{user.phone}</span>}
                </td>
                <td className="px-4 py-3 text-ink-500">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex flex-wrap gap-1">
                    <Badge tone="slate">{user._count.bookings} bookings</Badge>
                    <Badge tone="slate">{user._count.eventBookings} events</Badge>
                    <Badge tone="slate">{user._count.reviews} reviews</Badge>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <RoleSelect userId={user.id} role={user.role} />
                    {user.role === "ADMIN" && <Badge tone="gold">admin</Badge>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
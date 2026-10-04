import type { Metadata } from "next";
import Link from "next/link";
import { getAdminMessages } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "@/components/admin/message-actions";
import { MESSAGE_STATUS } from "@/lib/constants";
import { formatDateTime, cn } from "@/lib/utils";

export const metadata: Metadata = siteMeta({ title: "Messages", description: "Manage contact messages.", path: "/admin/messages", noindex: true });

type SP = { [key: string]: string | undefined };

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = sp.status === "NEW" || sp.status === "READ" || sp.status === "HANDLED" ? sp.status : "all";
  const messages = await getAdminMessages(status);

  const tab = (value: string, label: string) => (
    <Link href={`/admin/messages?status=${value}`} className={cn("rounded-full px-4 py-2 text-sm font-semibold", status === value ? "bg-forest-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200")}>
      {label}
    </Link>
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Messages</h1>
      <p className="mt-1 text-sm text-ink-500">Contact-form enquiries from the website.</p>

      <div className="mt-5 flex gap-2">
        {tab("all", "All")}
        {tab("NEW", "New")}
        {tab("READ", "Read")}
        {tab("HANDLED", "Handled")}
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((message) => {
          const statusInfo = MESSAGE_STATUS[message.status] ?? { label: message.status, tone: "slate" as const };
          return (
            <article key={message.id} className={cn("rounded-card border bg-white p-5 shadow-card", message.status === "NEW" ? "border-gold-400/60" : "border-ink-200/40")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display font-semibold text-ink-900">{message.subject || "General enquiry"}</p>
                  <p className="text-sm text-ink-500">
                    {message.name} · {message.email}
                    {message.phone && <> · {message.phone}</>}
                    {" · "}{formatDateTime(message.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={statusInfo.tone} dot>{statusInfo.label}</Badge>
                  <MessageActions messageId={message.id} status={message.status} />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">{message.message}</p>
            </article>
          );
        })}
        {messages.length === 0 && <p className="rounded-2xl border border-dashed border-ink-200 p-12 text-center text-sm text-ink-400">No messages here.</p>}
      </div>
    </div>
  );
}
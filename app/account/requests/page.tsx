import type { Metadata } from "next";
import { CalendarDays, ClipboardList } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/skeleton";
import { REQUEST_STATUS, STUDENT_PACKAGES } from "@/lib/constants";
import { formatDate, formatDateTime, formatETB, parseJson } from "@/lib/utils";

export const metadata: Metadata = siteMeta({
  title: "Service requests",
  description: "Track your requests with Yusho Travel.",
  path: "/account/requests",
  noindex: true,
});

export default async function RequestsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [studentServices, privateTours] = await Promise.all([
    prisma.studentService.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.privateTourRequest.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  const empty = studentServices.length === 0 && privateTours.length === 0;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Requests</h2>
      <p className="mt-1 text-sm text-ink-500">Student services, welcome packages and private-tour quotes.</p>

      {empty ? (
        <EmptyState
          className="mt-6"
          icon={<ClipboardList size={24} />}
          title="No requests yet"
          text="Request a student welcome package or a custom private tour and track it here."
        />
      ) : (
        <div className="mt-6 space-y-6">
          {studentServices.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-semibold text-ink-900">Student services</h3>
              <div className="mt-3 space-y-3">
                {studentServices.map((req) => {
                  const pkg = STUDENT_PACKAGES.find((p) => p.id === req.package);
                  const status = REQUEST_STATUS[req.status] ?? { label: req.status, tone: "slate" as const };
                  return (
                    <article key={req.id} className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-ink-900">{pkg?.shortName ?? req.package}</p>
                        <Badge tone={status.tone} dot>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-ink-500">
                        {req.fullName} · {req.phone} · Arriving {req.arrivalDate ? formatDate(req.arrivalDate) : "—"}
                        {req.arrivalLocation ? ` at ${req.arrivalLocation}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">Requested {formatDateTime(req.createdAt)}</p>
                      {req.adminResponse && (
                        <div className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">
                          <b>Yusho:</b> {req.adminResponse}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {privateTours.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-semibold text-ink-900">Private tour requests</h3>
              <div className="mt-3 space-y-3">
                {privateTours.map((req) => {
                  const status = REQUEST_STATUS[req.status] ?? { label: req.status, tone: "slate" as const };
                  const places = parseJson<string[]>(req.destinations, []);
                  return (
                    <article key={req.id} className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-ink-900">{req.name}</p>
                        <Badge tone={status.tone} dot>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-ink-500">
                        <CalendarDays size={13} className="mr-1 inline text-teal-700" />
                        {req.preferredDate ? (req.preferredEndDate ? `${formatDate(req.preferredDate)} – ${formatDate(req.preferredEndDate)}` : formatDate(req.preferredDate)) : "Flexible dates"} · {places.join(", ")}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">Requested {formatDateTime(req.createdAt)}</p>
                      {req.quotation != null && (
                        <p className="mt-2 inline-block rounded-full bg-gold-50 px-3 py-1 text-sm font-bold text-gold-900">
                          Quotation: {formatETB(req.quotation)}
                        </p>
                      )}
                      {req.adminResponse && (
                        <div className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">
                          <b>Yusho:</b> {req.adminResponse}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
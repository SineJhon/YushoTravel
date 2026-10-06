import type { Metadata } from "next";
import Link from "next/link";
import { getAdminStudentServices, getAdminPrivateTours } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { StudentRequestAction, PrivateRequestAction } from "@/components/admin/request-actions";
import { STUDENT_PACKAGES, REQUEST_STATUS } from "@/lib/constants";
import { formatDate, formatDateTime, formatETB, parseJson, cn } from "@/lib/utils";

export const metadata: Metadata = siteMeta({ title: "Services & requests", description: "Manage student services and private tour requests.", path: "/admin/services", noindex: true });

type SP = { [key: string]: string | undefined };

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const tab = sp.tab === "private" ? "private" : "student";
  const [students, privateTours] = await Promise.all([getAdminStudentServices(), getAdminPrivateTours()]);

  const tabLink = (value: string, label: string, count: number) => (
    <Link href={`/admin/services?tab=${value}`} className={cn("rounded-full px-4 py-2 text-sm font-semibold", tab === value ? "bg-forest-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200")}>
      {label} ({count})
    </Link>
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Services & requests</h1>
      <p className="mt-1 text-sm text-ink-500">Reply notes reach the customer's account instantly.</p>

      <div className="mt-5 flex gap-2">
        {tabLink("student", "Student services", students.length)}
        {tabLink("private", "Private tours", privateTours.length)}
      </div>

      <div className="mt-6 space-y-4">
        {tab === "student" &&
          students.map((req) => {
            const pkg = STUDENT_PACKAGES.find((p) => p.id === req.package);
            const status = REQUEST_STATUS[req.status] ?? { label: req.status, tone: "slate" as const };
            return (
              <article key={req.id} className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold text-ink-900">{req.fullName}</p>
                    <p className="text-sm text-ink-500">{req.phone} · {req.email ?? "no email"} · {pkg?.shortName ?? req.package}</p>
                  </div>
                  <Badge tone={status.tone} dot>{status.label}</Badge>
                </div>
                <p className="mt-3 text-sm text-ink-700">
                  Arrival: <b>{req.arrivalDate ? formatDate(req.arrivalDate) : "—"}</b> · {req.arrivalLocation ?? "location TBA"} · family {req.numberOfFamilyMembers} · requested {formatDateTime(req.createdAt)}
                </p>
                <p className="text-sm text-ink-700">
                  Needs: {[req.hotelRequired && "Hotel", req.tourRequired && "Tour", req.registrationAssistance && "Registration help", req.dormitoryAssistance && "Dormitory help"].filter(Boolean).join(", ") || "—"}
                </p>
                {req.notes && <p className="mt-1 text-sm text-ink-500"><b>Notes:</b> {req.notes}</p>}
                {req.adminResponse && <p className="mt-3 rounded-xl bg-teal-50 px-4 py-2.5 text-sm text-teal-900"><b>Sent note:</b> {req.adminResponse}</p>}
                <StudentRequestAction id={req.id} current={req.status} />
              </article>
            );
          })}

        {tab === "private" &&
          privateTours.map((req) => {
            const status = REQUEST_STATUS[req.status] ?? { label: req.status, tone: "slate" as const };
            const places = parseJson<string[]>(req.destinations, []);
            return (
              <article key={req.id} className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold text-ink-900">{req.name}</p>
                    <p className="text-sm text-ink-500">{req.phone} · {places.join(", ")}</p>
                  </div>
                  <Badge tone={status.tone} dot>{status.label}</Badge>
                </div>
                <p className="mt-3 text-sm text-ink-700">
                  {req.numberOfPeople} people · {req.preferredDate ? (req.preferredEndDate ? `${formatDate(req.preferredDate)} – ${formatDate(req.preferredEndDate)}` : formatDate(req.preferredDate)) : "flexible dates"} · {req.budgetRange ?? "no budget hint"} · transport: {req.transportPreference ?? "—"}
                </p>
                {req.specialRequests && <p className="mt-1 text-sm text-ink-500"><b>Special requests:</b> {req.specialRequests}</p>}
                {req.quotation != null && (
                  <p className="mt-2 inline-block rounded-full bg-gold-50 px-4 py-1.5 text-sm font-bold text-gold-900">Quotation: {formatETB(req.quotation)}</p>
                )}
                {req.adminResponse && <p className="mt-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm text-teal-900"><b>Sent note:</b> {req.adminResponse}</p>}
                <PrivateRequestAction id={req.id} current={req.status} quotation={req.quotation} />
              </article>
            );
          })}

        {(tab === "student" ? students.length === 0 : privateTours.length === 0) && (
          <p className="rounded-2xl border border-dashed border-ink-200 p-12 text-center text-sm text-ink-400">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}
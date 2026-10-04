import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { getAdminReviews } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewActions } from "@/components/admin/review-actions";
import { formatDate, cn } from "@/lib/utils";

export const metadata: Metadata = siteMeta({ title: "Reviews", description: "Moderate Yusho reviews.", path: "/admin/reviews", noindex: true });

type SP = { [key: string]: string | undefined };

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filter = sp.filter === "approved" || sp.filter === "pending" ? sp.filter : "all";
  const reviews = await getAdminReviews(filter);

  const tab = (value: "all" | "pending" | "approved", label: string) => (
    <Link
      href={`/admin/reviews?filter=${value}`}
      className={cn("rounded-full px-4 py-2 text-sm font-semibold", filter === value ? "bg-forest-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200")}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Reviews</h1>
      <p className="mt-1 text-sm text-ink-500">Approve, hide, feature or remove reviews.</p>

      <div className="mt-5 flex gap-2">
        {tab("all", "All")}
        {tab("pending", "Awaiting approval")}
        {tab("approved", "Approved")}
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar src={review.user.profileImage} name={review.user.name} size={38} />
                <div>
                  <p className="text-sm font-bold text-ink-900">{review.user.name}</p>
                  <p className="text-xs text-ink-400">
                    {review.destination ? (
                      <Link href={`/destinations/${review.destination.slug}`} target="_blank" className="hover:text-teal-700">{review.destination.name}</Link>
                    ) : review.event ? (
                      <Link href={`/events/${review.event.slug}`} target="_blank" className="hover:text-teal-700">{review.event.title}</Link>
                    ) : "—"}
                    {" · "}{formatDate(review.createdAt)}
                    {review.booking && <> · {review.booking.bookingRef}</>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} size={14} showValue={false} />
                <Badge tone={review.approved ? "green" : "amber"} dot>{review.approved ? "Approved" : "Pending"}</Badge>
                {review.featured && <Badge tone="gold">Featured</Badge>}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{review.comment}</p>
            <div className="mt-3 flex items-center gap-2 border-t border-ink-200/40 pt-3">
              <span className="text-xs font-semibold text-ink-400">Moderate:</span>
              <ReviewActions reviewId={review.id} approved={review.approved} featured={review.featured} />
            </div>
          </article>
        ))}
        {reviews.length === 0 && (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-200 p-12 text-sm text-ink-400">
            <Star size={16} /> No reviews in this view.
          </p>
        )}
      </div>
    </div>
  );
}
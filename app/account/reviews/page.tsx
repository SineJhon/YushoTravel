import type { Metadata } from "next";
import { Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { EmptyState } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = siteMeta({
  title: "My reviews",
  description: "Reviews you've left on Yusho Travel.",
  path: "/account/reviews",
  noindex: true,
});

export default async function MyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: { select: { name: true, slug: true } },
      event: { select: { title: true, slug: true } },
    },
  });

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">My reviews</h2>
      <p className="mt-1 text-sm text-ink-500">Reviews appear publicly after the Yusho team approves them.</p>

      {reviews.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Star size={24} />}
          title="No reviews yet"
          text="After a completed tour or event, you can leave a review from the booking detail page."
        />
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-card border border-ink-200/40 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={user.profileImage} name={user.name} size={36} />
                  <div>
                    <p className="text-sm font-bold text-ink-900">
                      {review.destination?.name ?? review.event?.title ?? "Experience"}
                    </p>
                    <span className="text-xs text-ink-400">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size={14} showValue={false} />
                  <Badge tone={review.approved ? "green" : "amber"} dot>{review.approved ? "Published" : "Pending approval"}</Badge>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { formatDate } from "@/lib/utils";

export type DetailReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  demoSeed: boolean;
  user: { id: string; name: string; profileImage: string | null };
};

export function ReviewList({ reviews }: { reviews: DetailReview[] }) {
  if (!reviews.length) {
    return (
      <div className="rounded-card border border-dashed border-ink-200 bg-sand-50 p-10 text-center">
        <MessageCircle size={26} className="mx-auto text-teal-600" />
        <p className="mt-3 font-semibold text-ink-900">No reviews yet</p>
        <p className="mt-1 text-sm text-ink-500">Be the first to review this experience after your tour.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="flex gap-4 rounded-card border border-ink-200/40 bg-white p-5">
          <Avatar src={review.user.profileImage} name={review.user.name} size={42} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink-900">{review.user.name}</p>
              <span className="text-xs text-ink-400">{formatDate(review.createdAt)}</span>
            </div>
            <StarRating value={review.rating} size={14} showValue={false} className="mt-1" />
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
              {review.comment.startsWith("[Demo") ? review.comment.replace(/^\[[^\]]*\]\s*/, "") : review.comment}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
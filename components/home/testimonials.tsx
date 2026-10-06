import { Quote } from "lucide-react";
import type { PublicReview } from "@/lib/data";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";

export function Testimonials({ reviews }: { reviews: PublicReview[] }) {
  if (!reviews.length) return null;

  return (
    <Section>
      <div className="container-x">
        <SectionHeading
          eyebrow="Words from travellers"
          title="Real reviews from real journeys"
          description="Every review below was left after a real tour, event or experience. Yours could be next."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal
              key={review.id}
              delay={i * 60}
              className="flex flex-col rounded-card border border-ink-200/40 bg-sand-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <StarRating value={review.rating} showValue={false} size={15} />
                <Quote size={26} className="text-gold-300" aria-hidden />
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">“{review.comment}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-ink-200/40 pt-4">
                <Avatar src={review.user.profileImage} name={review.user.name} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">{review.user.name}</p>
                  <p className="truncate text-xs text-ink-400">
                    {review.destination?.name ?? "Event"} · {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
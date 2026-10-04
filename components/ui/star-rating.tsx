import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = 16,
  className,
  showValue = true,
}: {
  value: number | null | undefined;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const rating = value ?? 0;
  const items = [];
  for (let i = 1; i <= 5; i += 1) {
    if (rating >= i - 0.25) {
      items.push(<Star key={i} size={size} className="fill-gold-500 text-gold-500" aria-hidden />);
    } else if (rating >= i - 0.75) {
      items.push(
        <span key={i} className="relative inline-flex" aria-hidden>
          <Star size={size} className="text-ink-200" />
          <StarHalf size={size} className="absolute inset-0 fill-gold-500 text-gold-500" />
        </span>,
      );
    } else {
      items.push(<Star key={i} size={size} className="text-ink-200" aria-hidden />);
    }
  }
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {items}
      {showValue && (
        <span className="ml-1.5 text-sm font-semibold text-ink-700">
          {rating > 0 ? rating.toFixed(1) : "—"}
        </span>
      )}
    </span>
  );
}

export function RatingInput({
  value,
  onChange,
  size = 30,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-teal-600 rounded"
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              n <= value ? "fill-gold-500 text-gold-500" : "fill-transparent text-ink-200",
              value > 0 && n <= value && "animate-scale-in",
            )}
          />
        </button>
      ))}
    </div>
  );
}
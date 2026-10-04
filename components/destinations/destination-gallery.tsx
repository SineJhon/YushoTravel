"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export function DestinationGallery({
  images,
  name,
}: {
  images: { id: string; imageUrl: string; altText: string | null }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const list = images.length ? images : [{ id: "fallback", imageUrl: "/images/seed/hero-alt.webp", altText: name }];

  const current = list[Math.min(active, list.length - 1)];

  function step(dir: 1 | -1) {
    setActive((prev) => (prev + dir + list.length) % list.length);
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-[1.75rem] shadow-card">
        <LazyImage
          src={current.imageUrl}
          alt={current.altText ?? name}
          boxClass="aspect-[16/10] sm:aspect-[16/9]"
          sizes="(max-width: 1024px) 100vw, 70vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" aria-hidden />
        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-forest-950/60 px-4 py-2 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-forest-950/85"
        >
          <Expand size={14} /> View gallery
        </button>
        {list.length > 1 && (
          <>
            <button
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/45 text-white backdrop-blur transition-colors hover:bg-forest-950/75"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/45 text-white backdrop-blur transition-colors hover:bg-forest-950/75"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {list.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl transition-all",
                i === active ? "ring-2 ring-gold-400 ring-offset-2" : "opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
            >
              <LazyImage src={image.imageUrl} alt={image.altText ?? name} boxClass="aspect-[4/3] w-28" sizes="112px" />
            </button>
          ))}
        </div>
      )}

      <Modal open={lightbox} onClose={() => setLightbox(false)} maxWidth="max-w-5xl">
        <div className="relative">
          <LazyImage src={current.imageUrl} alt={current.altText ?? name} boxClass="aspect-[16/10]" sizes="100vw" />
          <p className="mt-3 text-sm text-ink-500">{current.altText ?? name} · {active + 1} / {list.length}</p>
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => step(-1)} className="rounded-full bg-sand-100 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-sand-200">
            ← Previous
          </button>
          <button onClick={() => step(1)} className="rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-900">
            Next →
          </button>
        </div>
      </Modal>
    </div>
  );
}
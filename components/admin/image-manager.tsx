"use client";

import { useRef, useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImageAction } from "@/lib/actions/upload";
import { LazyImage } from "@/components/ui/lazy-image";
import { Input } from "@/components/ui/controls";

export function ImageManager({
  images,
  onChange,
  compact = false,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  compact?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addUrl() {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      toast.error("That image is already added.");
      return;
    }
    onChange([...images, trimmed]);
    setUrl("");
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    onChange([...images, res.url]);
    toast.success("Uploaded");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl">
            <LazyImage src={src} alt={`Image ${i + 1}`} boxClass="aspect-[4/3] w-24 sm:w-28" sizes="112px" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-forest-950/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={12} />
            </button>
            {i === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-gold-400 px-1.5 py-0.5 text-[9px] font-bold text-forest-950">Cover</span>}
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100 disabled:opacity-50"
          >
            <Upload size={14} /> {busy ? "Uploading…" : "Upload image"}
          </button>
          <div className="flex flex-1 gap-2">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Or paste an image URL (https://…)" />
            <button
              type="button"
              onClick={addUrl}
              className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      )}
      {compact && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:underline"
        >
          <Upload size={13} /> {busy ? "Uploading…" : "Upload image"}
        </button>
      )}
    </div>
  );
}
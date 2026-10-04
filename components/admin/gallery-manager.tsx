"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addGalleryImageAction, deleteGalleryImageAction } from "@/lib/actions/admin-ops";
import { uploadImageAction } from "@/lib/actions/upload";
import { toastResult } from "./toast-result";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/controls";
import { LazyImage } from "@/components/ui/lazy-image";

export function GalleryManager({ images }: { images: { id: string; imageUrl: string; caption: string | null; featured: boolean }[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [featured, setFeatured] = useState(false);
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!url.trim()) return toast.error("Provide an image URL or upload first.");
    setBusy(true);
    const res = await addGalleryImageAction({ imageUrl: url, caption: caption || undefined, featured });
    setBusy(false);
    toastResult(res, "Added to gallery");
    setUrl("");
    setCaption("");
    setFeatured(false);
    router.refresh();
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    setUrl(res.url);
    toast.success("Uploaded — add a caption and save.");
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this image?")) return;
    const res = await deleteGalleryImageAction({ id });
    toastResult(res, "Removed");
    router.refresh();
  }

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-ink-200/40 bg-white p-5 shadow-card sm:grid-cols-2">
        <Field label="Image URL">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/uploads/… or https://…" />
        </Field>
        <Field label="Caption" optional>
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 accent-teal-600" /> Featured
        </label>
        <div className="flex gap-2">
          <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-sand-100">
            <Upload size={14} /> {busy ? "Uploading…" : "Upload file"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          <Button type="button" variant="primary" size="md" onClick={add} disabled={busy}>
            Add to gallery
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <figure key={image.id} className="group relative overflow-hidden rounded-xl">
            <LazyImage src={image.imageUrl} alt={image.caption ?? "Gallery image"} boxClass="aspect-[4/3]" sizes="(max-width: 768px) 50vw, 25vw" />
            {image.featured && <figcaption className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-forest-950">Featured</figcaption>}
            <button
              onClick={() => remove(image.id)}
              aria-label="Remove image"
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-forest-950/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}
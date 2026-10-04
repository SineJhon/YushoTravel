import type { Metadata } from "next";
import { getAdminGalleryImages } from "@/lib/data-admin";
import { siteMeta } from "@/lib/seo";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = siteMeta({ title: "Gallery", description: "Manage the Yusho image gallery.", path: "/admin/gallery", noindex: true });

export default async function AdminGalleryPage() {
  const images = await getAdminGalleryImages();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Gallery</h1>
      <p className="mt-1 text-sm text-ink-500">{images.length} images · uploads are validated and stored locally.</p>
      <div className="mt-6">
        <GalleryManager images={images} />
      </div>
    </div>
  );
}
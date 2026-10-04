"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { ALLOWED_IMAGE_EXT, MAX_UPLOAD_BYTES } from "@/lib/images";

export type UploadResult =
  | { ok: true; url: string; message: string }
  | { ok: false; error: string };

/**
 * Validated image upload. Saves to /public/uploads and returns a public URL.
 * Guarded to signed-in users; mime/extension/size checked server-side.
 */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to continue." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file received." };

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image must be smaller than 8 MB." };
  }
  if (file.size === 0) return { ok: false, error: "The file appears to be empty." };

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_IMAGE_EXT.includes(ext)) {
    return { ok: false, error: "Only JPG, PNG, WebP, GIF or AVIF images are allowed." };
  }

  // Validate real content type when available.
  if (file.type && !file.type.startsWith("image/")) {
    return { ok: false, error: "That file doesn't look like an image." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), bytes);

  return {
    ok: true,
    url: `/uploads/${safeName}`,
    message: "Image uploaded",
  };
}
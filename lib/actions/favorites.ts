"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { type ActionRes } from "@/lib/actions/helpers";

export async function toggleSaveDestinationAction(input: {
  destinationId: string;
}): Promise<ActionRes & { saved?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to save destinations." };

  const existing = await prisma.savedDestination.findUnique({
    where: {
      userId_destinationId: { userId: user.id, destinationId: input.destinationId },
    },
  });
  if (existing) {
    await prisma.savedDestination.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedDestination.create({
      data: { userId: user.id, destinationId: input.destinationId },
    });
  }
  revalidatePath("/account/saved");
  revalidatePath(`/destinations`, "layout");
  return { ok: true, saved: !existing, message: existing ? "Removed from saved." : "Saved to your list." };
}

export async function isDestinationSavedForUser(destinationId: string) {
  const user = await getCurrentUser();
  if (!user) return false;
  const found = await prisma.savedDestination.findUnique({
    where: { userId_destinationId: { userId: user.id, destinationId } },
  });
  return !!found;
}

export async function getSavedIdsForUser() {
  const user = await getCurrentUser();
  if (!user) return new Set<string>();
  const rows = await prisma.savedDestination.findMany({
    where: { userId: user.id },
    select: { destinationId: true },
  });
  return new Set(rows.map((r) => r.destinationId));
}
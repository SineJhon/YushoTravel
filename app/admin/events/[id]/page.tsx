import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { siteMeta } from "@/lib/seo";
import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = siteMeta({ title: "Edit event", description: "Edit an event.", path: "/admin/events", noindex: true });

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Edit event</h1>
      <p className="mt-1 text-sm text-ink-500">
        {event.availableSeats}/{event.capacity} seats left · changing capacity adjusts availability automatically.
      </p>
      <div className="mt-6 max-w-3xl">
        <EventForm event={event} mode="edit" />
      </div>
    </div>
  );
}
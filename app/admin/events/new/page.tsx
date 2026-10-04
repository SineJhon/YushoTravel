import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = siteMeta({ title: "New event", description: "Create an event.", path: "/admin/events/new", noindex: true });

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">New event</h1>
      <p className="mt-1 text-sm text-ink-500">Publish a new event — travellers can book seats instantly.</p>
      <div className="mt-6 max-w-3xl">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
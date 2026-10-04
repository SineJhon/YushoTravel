import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import { DestinationForm } from "@/components/admin/destination-form";

export const metadata: Metadata = siteMeta({ title: "New destination", description: "Create a destination.", path: "/admin/destinations/new", noindex: true });

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">New destination</h1>
      <p className="mt-1 text-sm text-ink-500">Create a destination — it goes live instantly and is bookable by travellers.</p>
      <div className="mt-6 max-w-3xl">
        <DestinationForm mode="create" />
      </div>
    </div>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationById } from "@/lib/data";
import { siteMeta } from "@/lib/seo";
import { DestinationForm } from "@/components/admin/destination-form";
import { PackageManager } from "@/components/admin/package-manager";

export const metadata: Metadata = siteMeta({ title: "Edit destination", description: "Edit a destination.", path: "/admin/destinations", noindex: true });

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await getDestinationById(id);
  if (!destination) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Edit destination</h1>
          <p className="mt-1 text-sm text-ink-500">
            <Link href={`/destinations/${destination.slug}`} target="_blank" className="font-semibold text-teal-700 hover:underline">
              /destinations/{destination.slug}
            </Link>{" "}
            · {destination.active ? "live & bookable" : "inactive"}
          </p>
        </div>
      </div>
      <div className="mt-6 max-w-3xl space-y-6">
        <DestinationForm destination={destination} mode="edit" />
        <PackageManager destinationId={destination.id} packages={destination.packages} />
      </div>
    </div>
  );
}
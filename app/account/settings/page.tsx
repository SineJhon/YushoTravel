import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { siteMeta } from "@/lib/seo";
import { SettingsForm } from "@/components/account/settings-form";

export const metadata: Metadata = siteMeta({
  title: "Settings",
  description: "Update your Yusho Travel profile and password.",
  path: "/account/settings",
  noindex: true,
});

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">Settings</h2>
      <p className="mt-1 text-sm text-ink-500">Keep your account up to date.</p>
      <div className="mt-6 max-w-2xl">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
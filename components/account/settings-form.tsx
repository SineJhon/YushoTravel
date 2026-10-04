"use client";

import { useRef, useState } from "react";
import { Camera, KeyRound, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction, changePasswordAction } from "@/lib/actions/auth";
import { uploadImageAction } from "@/lib/actions/upload";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/controls";
import { Avatar } from "@/components/ui/avatar";

type SettingsUser = { id: string; name: string; email: string; phone: string | null; bio: string | null; profileImage: string | null };

export function SettingsForm({ user }: { user: SettingsUser }) {
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone ?? "", bio: user.bio ?? "", profileImage: user.profileImage ?? "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState<{ profile: boolean; password: boolean; upload: boolean }>({ profile: false, password: false, upload: false });
  const [error, setError] = useState<{ profile?: string; password?: string }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy((b) => ({ ...b, profile: true }));
    setError({});
    const res = await updateProfileAction(profile);
    setBusy((b) => ({ ...b, profile: false }));
    if (!res.ok) return setError({ profile: res.error });
    toast.success("Profile updated.");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy((b) => ({ ...b, password: true }));
    setError({});
    if (password.newPassword !== password.confirm) {
      setError({ password: "New passwords don't match." });
      setBusy((b) => ({ ...b, password: false }));
      return;
    }
    const res = await changePasswordAction({ currentPassword: password.currentPassword, newPassword: password.newPassword });
    setBusy((b) => ({ ...b, password: false }));
    if (!res.ok) return setError({ password: res.error });
    toast.success("Password changed.");
    setPassword({ currentPassword: "", newPassword: "", confirm: "" });
  }

  async function uploadAvatar(file: File | undefined) {
    if (!file) return;
    setBusy((b) => ({ ...b, upload: true }));
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    setBusy((b) => ({ ...b, upload: false }));
    if (!res.ok) return toast.error(res.error);
    setProfile((p) => ({ ...p, profileImage: res.url }));
    toast.success("Photo uploaded — save your profile to keep it.");
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} className="rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
          <Camera size={18} className="text-teal-700" /> Profile
        </h3>

        {!!error.profile && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error.profile}</div>}

        <div className="mt-5 flex items-center gap-5">
          <Avatar src={profile.profileImage} name={profile.name} size={72} />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            aria-label="Upload profile photo"
            disabled={busy.upload}
            onChange={(e) => uploadAvatar(e.target.files?.[0])}
          />
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100">
            <Upload size={15} /> {busy.upload ? "Uploading…" : "Upload photo"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} autoComplete="name" />
          </Field>
          <Field label="Phone">
            <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} inputMode="tel" autoComplete="tel" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Bio" optional>
              <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="A short line about you…" className="min-h-20" />
            </Field>
          </div>
        </div>

        <Button type="submit" variant="primary" size="md" loading={busy.profile} className="mt-5">
          <Save size={15} /> Save profile
        </Button>
      </form>
<PasswordForm busy={busy.password} error={error.password} password={password} setPassword={setPassword} onSubmit={changePassword} />
    </div>
  );
}

function PasswordForm({
  busy, error, password, setPassword, onSubmit,
}: {
  busy: boolean;
  error?: string;
  password: { currentPassword: string; newPassword: string; confirm: string };
  setPassword: (p: { currentPassword: string; newPassword: string; confirm: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-ink-200/40 bg-white p-6 shadow-card">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
        <KeyRound size={18} className="text-teal-700" /> Change password
      </h3>
      {!!error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</div>}
      <div className="mt-5 space-y-4">
        <Field label="Current password">
          <Input type="password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} autoComplete="current-password" />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <Input type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password">
          <Input type="password" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} autoComplete="new-password" />
        </Field>
      </div>
      <Button type="submit" variant="gold" size="md" loading={busy} className="mt-5">
        <KeyRound size={15} /> Update password
      </Button>
    </form>
  );
}
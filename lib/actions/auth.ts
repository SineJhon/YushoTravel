"use server";

import { createHash, randomBytes } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import {
  registerSchema,
  loginSchema,
  profileSchema,
  changePasswordSchema,
  resetRequestSchema,
  resetConfirmSchema,
} from "@/lib/validations";
import { clientAddress, ipKey, rateLimit } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/constants";

export type ActionResult =
  | { ok: true; message?: string; admin?: boolean; data?: unknown }
  | { ok: false; error: string };

function firstError(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Your input is invalid.";
}

export async function registerAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const hdrs = await headers();
  const ip = clientAddress(hdrs.get("x-forwarded-for"));
  const rl = rateLimit(ipKey(ip, "register"), 8, 60_000);
  if (!rl.ok) return { ok: false, error: "Too many attempts — try again in a minute." };

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { ok: false, error: "An account with that email already exists." };

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });
  await createSession(user);
  revalidatePath("/", "layout");
  return { ok: true, message: "Welcome to Yusho Travel — your account is ready." };
}

export async function loginAction(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const hdrs = await headers();
  const ip = clientAddress(hdrs.get("x-forwarded-for"));
  const rl = rateLimit(ipKey(ip, "login"), 12, 60_000);
  if (!rl.ok) return { ok: false, error: "Too many attempts — try again in a minute." };

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, error: "Email or password is incorrect." };
  }

  await createSession(user);
  revalidatePath("/", "layout");
  return { ok: true, admin: user.role === "ADMIN" };
}

export async function logoutAction(): Promise<ActionResult> {
  await destroySession();
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to continue." };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const { name, phone, bio, profileImage } = parsed.data;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      phone: phone || null,
      bio: bio || null,
      profileImage: profileImage || null,
    },
  });
  revalidatePath("/account", "layout");
  return { ok: true, message: "Profile updated." };
}

export async function changePasswordAction(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to continue." };

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const current = await prisma.user.findUnique({ where: { id: user.id } });
  if (!current || !(await verifyPassword(parsed.data.currentPassword, current.passwordHash))) {
    return { ok: false, error: "Your current password is incorrect." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  return { ok: true, message: "Password changed successfully." };
}
// ── Password reset ──────────────────────────────────────────────────────────

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordResetAction(input: unknown): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Same friendly response either way — never leak which emails exist.
  if (!user) {
    return { ok: true, message: "If an account exists for that email, a reset link has been sent." };
  }

  const token = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashToken(token),
      resetExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;

  // Email delivery: connect an email provider (Resend/SendGrid/SES…) and send
  // the link. Until SMTP is configured, development returns & logs the link so
  // the flow can be tested end-to-end — an explicitly marked DEV behaviour.
  if (process.env.NODE_ENV !== "production") {
    console.info(`[Yusho] Password reset link for ${user.email}: ${resetUrl}`);
    return {
      ok: true,
      message:
        "A reset link was created. (Development mode — the link is shown next so you can test the flow.)",
      data: { devResetUrl: resetUrl },
    };
  }

  return { ok: true, message: "If an account exists for that email, a reset link has been sent." };
}

export async function confirmPasswordResetAction(input: unknown): Promise<ActionResult> {
  const parsed = resetConfirmSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const tokenHash = hashToken(parsed.data.token);
  const user = await prisma.user.findFirst({
    where: { resetToken: tokenHash, resetExpiry: { gt: new Date() } },
  });
  if (!user) {
    return { ok: false, error: "This reset link is invalid or has expired. Request a new one." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(parsed.data.password),
      resetToken: null,
      resetExpiry: null,
    },
  });

  return { ok: true, message: "Password reset successfully — you can now sign in." };
}
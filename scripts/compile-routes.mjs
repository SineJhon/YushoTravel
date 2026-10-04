import { PrismaClient } from "@prisma/client";

// Compile admin/dashboard routes as an authenticated admin so all server-action
// IDs register in the dev manifest, and print status codes.
const prisma = new PrismaClient();
const BASE = "http://localhost:3100";
const LOGIN_ID = "40e94ce15572eade68944b9a0e44e9ca04492d7a5f";

async function main() {
  // First, create a dedicated test account if it doesn't exist.
  const testEmail = "tester@yusho.dev";
  let count = await prisma.user.count({ where: { email: testEmail } });
  if (!count) {
    await prisma.user.create({
      data: { name: "Tester", email: testEmail, passwordHash: await bcryptTest(), role: "USER" },
    });
    console.log("created", testEmail);
  }
  await prisma.$disconnect();

  const login = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Next-Action": LOGIN_ID, "Content-Type": "application/json" },
    body: JSON.stringify([{ email: "admin@yusho.travel", password: "Yusho@Admin2026" }]),
  });
  const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
  console.log("admin login:", login.status, cookie ? "cookie set" : "NO COOKIE");

  const pages = [
    "/admin", "/admin/destinations", "/admin/destinations/new", "/admin/events", "/admin/events/new",
    "/admin/bookings", "/admin/services", "/admin/reviews", "/admin/customers", "/admin/messages",
    "/admin/gallery", "/account", "/account/bookings", "/account/settings", "/account/saved",
    "/account/requests", "/account/reviews", "/book",
  ];
  for (const p of pages) {
    const res = await fetch(`${BASE}${p}`, { headers: { Cookie: cookie } });
    console.log(p, "-", res.status);
  }
}

const bcryptTest = () => import("bcryptjs").then((m) => m.hash("Tester@2026", 12));

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
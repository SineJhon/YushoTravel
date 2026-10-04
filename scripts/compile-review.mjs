import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = "http://localhost:3100";
const LOGIN_ID = "40e94ce15572eade68944b9a0e44e9ca04492d7a5f";

async function main() {
  const b = await prisma.booking.findFirst({ where: { user: { email: "demo.yusho@example.com" }, status: "COMPLETED" } });
  const login = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Next-Action": LOGIN_ID, "Content-Type": "application/json" },
    body: JSON.stringify([{ email: "demo.yusho@example.com", password: "Demo@2026" }]),
  });
  const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
  if (b) {
    const r = await fetch(`${BASE}/account/bookings/${b.id}`, { headers: { Cookie: cookie } });
    console.log("demo completed booking detail:", r.status, "| booking:", b.bookingRef);
  } else {
    console.log("no completed demo booking");
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
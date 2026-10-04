import { PrismaClient } from "@prisma/client";
import { A, call, check, futureDate } from "./smoke-lib.mjs";

export const prisma = new PrismaClient();

export async function testAuth() {
  console.log("\n— AUTH —");
  const regEmail = `smoke_${Date.now()}@yusho.dev`;
  let r = await call(A.register, { name: "Smoke Tester", email: regEmail, password: "Smoke@2026" });
  check("register creates account + session", r.result?.ok === true, JSON.stringify(r.result));

  r = await call(A.login, { email: "demo.yusho@example.com", password: "nope-nope" });
  check("login rejects wrong password", r.result?.ok === false, r.result?.text);

  r = await call(A.login, { email: "demo.yusho@example.com", password: "Demo@2026" });
  const demo = r.setCookie.split(";")[0];
  check("demo login sets cookie", r.result?.ok === true && demo.length > 0, r.result?.error ?? "");
  return { regEmail, demo };
}

export async function testBookings(demo, regEmail, ids) {
  console.log("\n— BOOKINGS —");
  const { destination, pkg, event } = ids;

  let r = await call(A.booking, {
    destinationId: destination.id,
    packageId: pkg.id,
    date: futureDate(10),
    numberOfPeople: 3,
    mode: "GROUP",
    addOns: ["lunch"],
    customerName: "Smoke Tester",
    customerPhone: "+251911111111",
    customerEmail: regEmail,
    specialRequest: "smoke test",
  }, demo);
  check("create booking ok", r.result?.ok === true && !!r.result?.data?.bookingRef, r.result?.error ?? r.text);
  const bookingRef = r.result?.data?.bookingRef;

  const createdBooking = await prisma.booking.findFirst({ where: { bookingRef } });

  r = await call(A.booking, {
    destinationId: destination.id, packageId: pkg.id, date: futureDate(-10), numberOfPeople: 1,
    mode: "GROUP", addOns: [], customerName: "Smoke Tester", customerPhone: "+251911111111", customerEmail: regEmail,
  }, demo);
  check("past date booking rejected", r.result?.ok === false, r.result?.error ?? "");

  r = await call(A.booking, {
    destinationId: destination.id, packageId: pkg.id, date: futureDate(10), numberOfPeople: 1,
    mode: "GROUP", addOns: [], customerName: "Guest", customerPhone: "+251911111111", customerEmail: "guest@yusho.dev",
  });
  check("guest booking rejected", r.result?.ok === false, r.result?.error ?? "");

  r = await call(A.eventBooking, { eventId: event.id, quantity: 2, attendeeName: "Smoke Tester", attendeePhone: "+251911111111" }, demo);
  check("event booking ok", r.result?.ok === true && !!r.result?.data?.reference, r.result?.error ?? r.text);

  const eventEventCountBefore = (await prisma.event.findUnique({ where: { id: event.id } })).availableSeats;
  r = await call(A.eventBooking, { eventId: event.id, quantity: 9999, attendeeName: "Over", attendeePhone: "+251911111111" }, demo);
  check("overbooking event rejected", r.result?.ok === false, r.result?.error ?? "");
  const eventEventCountAfter = (await prisma.event.findUnique({ where: { id: event.id } })).availableSeats;
  check("seats unchanged after rejected overbooking", eventEventCountBefore === eventEventCountAfter, "before/after mismatch");

  r = await call(A.cancelBooking, { bookingId: createdBooking.id }, demo);
  check("cancel booking ok", r.result?.ok === true, r.result?.error ?? "");

  r = await call(A.cancelBooking, { bookingId: "does-not-exist" }, demo);
  check("cancel unknown booking rejected", r.result?.ok === false, r.result?.error ?? "");

  // Deterministic save/unsave: remove any pre-existing saved row first.
  const demoUser = await prisma.user.findUnique({ where: { email: "demo.yusho@example.com" } });
  await prisma.savedDestination.deleteMany({ where: { userId: demoUser.id, destinationId: destination.id } });
  r = await call(A.save, { destinationId: destination.id }, demo);
  check("save destination ok", r.result?.ok === true && r.result?.saved === true, JSON.stringify(r.result));
  r = await call(A.save, { destinationId: destination.id }, demo);
  check("unsave destination ok", r.result?.ok === true && r.result?.saved === false, JSON.stringify(r.result));

  return { bookingRef, createdBooking };
}
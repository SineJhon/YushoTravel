import { prisma } from "./smoke-tests1.mjs";
import { testAuth, testBookings } from "./smoke-tests1.mjs";
import { testRequests, testReset, testAdmin } from "./smoke-tests2.mjs";
import { passed, failed } from "./smoke-lib.mjs";

async function main() {
  const destination = await prisma.destination.findFirst({ where: { active: true, demoSeed: true } });
  const pkg = await prisma.tourPackage.findFirst({ where: { destinationId: destination.id, active: true } });
  const completedBooking = await prisma.booking.findFirst({ where: { user: { email: "demo.yusho@example.com" }, status: "COMPLETED" } });
  const event = await prisma.event.findFirst({ where: { status: { notIn: ["CANCELLED", "DRAFT"] }, date: { gt: new Date() } } });

  const { regEmail, demo } = await testAuth();
  const { createdBooking } = await testBookings(demo, regEmail, { destination, pkg, event });

  const ids = { destination, completedBooking, createdBooking };
  const { reviewRow, completedForReview } = await testRequests(demo, regEmail, ids);

  await testReset(regEmail);
  await testAdmin(createdBooking.id, reviewRow.id);

  // Cleanup
  if (completedForReview) await prisma.booking.delete({ where: { id: completedForReview.id } });
  const bookingRows = await prisma.booking.findMany({ where: { user: { email: regEmail } } });
  for (const b of bookingRows) await prisma.booking.delete({ where: { id: b.id } });
  const ebRows = await prisma.eventBooking.findMany({ where: { user: { email: regEmail } } });
  for (const eb of ebRows) await prisma.eventBooking.delete({ where: { id: eb.id } });
  await prisma.studentService.deleteMany({ where: { notes: "smoke" } });
  const reviewRowFresh = await prisma.review.findFirst({ where: { comment: "Smoke test review" } });
  if (reviewRowFresh) await prisma.review.delete({ where: { id: reviewRowFresh.id } });
  const userRows = await prisma.user.findMany({ where: { email: regEmail } });
  for (const u of userRows) await prisma.user.delete({ where: { id: u.id } });

  // Clean up any destination rows a crashed/interrupted run may have left behind.
  await prisma.destination.deleteMany({
    where: { OR: [{ slug: { startsWith: "smoke-dest-" } }, { name: "Smoke Destination" }] },
  });

  await prisma.$disconnect();

  console.log(`\n══════════════════════════════`);
  console.log(`PASSED: ${passed}   FAILED: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (e) => {
  console.error("SMOKE ERROR", e);
  await prisma.$disconnect();
  process.exit(1);
});
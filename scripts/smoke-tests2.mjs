import { PrismaClient } from "@prisma/client";
import { A, call, check, futureDate } from "./smoke-lib.mjs";

export const prisma = new PrismaClient();

export async function testRequests(demo, regEmail, ids) {
  console.log("\n— REQUESTS & REVIEWS —");
  const { destination, createdBooking } = ids;

  let r = await call(A.privateTour, {
    name: "Smoke Tester", phone: "+251911111111", email: regEmail, numberOfPeople: 3,
    preferredDate: futureDate(15), preferredEndDate: futureDate(18), destinationIds: [destination.id],
    transportPreference: "Private vehicle for the tour",
    hotelRequired: true, foodRequired: false, budgetRange: "ETB 10,000 – 25,000",
  }, demo);
  check("private tour request ok", r.result?.ok === true, r.result?.error ?? "");

  r = await call(A.privateTour, {
    name: "No Dest", phone: "+251911111111", email: regEmail, numberOfPeople: 2,
    destinationIds: [], transportPreference: "", hotelRequired: false, foodRequired: false,
  }, demo);
  check("private tour without destination rejected", r.result?.ok === false, r.result?.error ?? "");

  r = await call(A.studentService, {
    package: "YUSHO_STAY", fullName: "Smoke Tester", phone: "+251911111111", email: regEmail,
    arrivalDate: futureDate(20), arrivalLocation: "Arba Minch Airport", numberOfFamilyMembers: 2,
    hotelRequired: true, tourRequired: true, registrationAssistance: false, dormitoryAssistance: false, notes: "smoke",
  }, demo);
  check("student service request ok", r.result?.ok === true, r.result?.error ?? "");

  r = await call(A.contact, { name: "Smoke Tester", email: regEmail, phone: "+251911111111", subject: "smoke", message: "smoke test message" });
  check("contact message ok", r.result?.ok === true, r.result?.error ?? "");

  r = await call(A.review, { bookingId: createdBooking.id, rating: 5, comment: "should fail" }, demo);
  check("review on cancelled booking rejected", r.result?.ok === false, r.result?.error ?? "");

  // Dedicated completed booking so the review flow is deterministic.
  const pkgRow = await prisma.tourPackage.findFirst({ where: { destinationId: destination.id, active: true } });
  const demoUser = await prisma.user.findUnique({ where: { email: "demo.yusho@example.com" } });
  const completedForReview = await prisma.booking.create({
    data: {
      bookingRef: `YS-SMOKE-${Date.now()}`,
      userId: demoUser.id,
      destinationId: destination.id,
      packageId: pkgRow.id,
      date: new Date(Date.now() - 3 * 864e5),
      numberOfPeople: 2,
      mode: "GROUP",
      customerName: "Smoke Tester",
      customerPhone: "+251911111111",
      customerEmail: regEmail,
      totalPrice: pkgRow.price * 2,
      status: "COMPLETED",
    },
  });

  r = await call(A.review, { bookingId: completedForReview.id, rating: 5, comment: "Smoke test review" }, demo);
  check("review on completed booking ok", r.result?.ok === true, r.result?.error ?? "");

  r = await call(A.review, { bookingId: completedForReview.id, rating: 4, comment: "duplicate!" }, demo);
  check("duplicate review rejected", r.result?.ok === false && /already/.test(r.result?.error ?? ""), r.result?.error ?? "");

  const reviewRow = await prisma.review.findFirst({ where: { comment: "Smoke test review" } });
  return { reviewRow, completedForReview };
}

export async function testReset(regEmail) {
  console.log("\n— PASSWORD RESET —");
  let r = await call(A.resetRequest, { email: regEmail });
  check("reset link issued (dev)", r.result?.ok === true && !!r.result?.data?.devResetUrl, JSON.stringify(r.result));
  const token = (r.result?.data?.devResetUrl ?? "").split("token=")[1];
  if (!token) {
    check("reset token present", false, "no dev token returned");
    return;
  }
  r = await call(A.resetConfirm, { token, password: "NewPass@2026" });
  check("reset password ok", r.result?.ok === true, r.result?.error ?? "");
  r = await call(A.login, { email: regEmail, password: "NewPass@2026" });
  check("login with new password ok", r.result?.ok === true, r.result?.error ?? "");
}

export async function testAdmin(bookingId, reviewRowId) {
  console.log("\n— ADMIN —");
  let r = await call(A.login, { email: "admin@yusho.travel", password: "Yusho@Admin2026" });
  const admin = r.setCookie.split(";")[0];
  check("admin login ok", r.result?.ok === true && r.result?.admin === true, r.result?.error ?? "");

  r = await call(A.adminStatus, { bookingId, status: "REJECTED" }, admin);
  check("admin updates booking status", r.result?.ok === true, r.result?.error ?? r.text);
  const updated = await prisma.booking.findUnique({ where: { id: bookingId } });
  check("booking status persisted", updated?.status === "REJECTED", `status=${updated?.status}`);

  r = await call(A.moderateReview, { reviewId: reviewRowId, action: "approve" }, admin);
  check("moderate review approve", r.result?.ok === true, r.result?.error ?? "");
  const review = await prisma.review.findUnique({ where: { id: reviewRowId } });
  check("review approved persisted", review?.approved === true, "not approved");

  const smokeService = await prisma.studentService.findFirst({ where: { notes: "smoke" }, orderBy: { createdAt: "desc" } });
  r = await call(A.studentStatus, { id: smokeService.id, status: "CONTACTED", adminResponse: "We will call you tomorrow." }, admin);
  check("student service status update", r.result?.ok === true, r.result?.error ?? "");
  const svc = await prisma.studentService.findUnique({ where: { id: smokeService.id } });
  check("admin note persisted", svc?.adminResponse?.includes("call you tomorrow") === true, "note missing");
  check("student status persisted", svc?.status === "CONTACTED", svc?.status);

  const slug = `smoke-dest-${Date.now()}`;
  r = await call(A.createDestination, {
    name: "Smoke Destination", slug, tagline: "t",
    description: "A temporary destination created by the smoke test to verify the full CRUD path.",
    location: "Test", region: "Test", duration: "Full day", durationHours: 8, basePrice: 100,
    category: "Nature", highlights: "test", thingsToDo: "test", whatsIncluded: "", whatsExcluded: "",
    requirements: "", meetingInfo: "", latitude: 0, longitude: 0, mapQuery: "test", featured: false, active: true, images: [],
  }, admin);
  check("admin creates destination", r.result?.ok === true, r.result?.error ?? "");
  const created = await prisma.destination.findUnique({ where: { slug } });
  if (created) {
    r = await call(A.deleteDestination, created.id, admin);
    check("admin deletes destination", r.result?.ok === true, r.result?.error ?? "");
  } else {
    check("destination row created", false, "missing row");
  }

  r = await call(A.addGallery, { imageUrl: "/images/seed/hero.webp", caption: "smoke", featured: false }, admin);
  check("gallery add", r.result?.ok === true, r.result?.error ?? "");
  const imgRow = await prisma.galleryImage.findFirst({ where: { caption: "smoke" }, orderBy: { createdAt: "desc" } });
  if (imgRow) {
    r = await call(A.deleteGallery, { id: imgRow.id }, admin);
    check("gallery delete", r.result?.ok === true, r.result?.error ?? "");
  } else {
    check("gallery row created", false, "missing row");
  }
}
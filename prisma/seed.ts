import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { destinationsData } from "./seed/destinations-data";
import { eventsData } from "./seed/events-data";
import { daysFromNow, DEMO_EMAIL, DEMO_PASSWORD, img } from "./seed/helpers";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning previous seed data…");

  await prisma.savedDestination.deleteMany({ where: { user: { email: DEMO_EMAIL } } });
  await prisma.review.deleteMany({ where: { demoSeed: true } });
  await prisma.booking.deleteMany({ where: { user: { email: DEMO_EMAIL } } });
  await prisma.eventBooking.deleteMany({ where: { user: { email: DEMO_EMAIL } } });
  await prisma.studentService.deleteMany({ where: { user: { email: DEMO_EMAIL } } });
  await prisma.privateTourRequest.deleteMany({ where: { user: { email: DEMO_EMAIL } } });
  await prisma.destination.deleteMany({ where: { demoSeed: true } });
  await prisma.event.deleteMany({ where: { demoSeed: true } });

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yusho.travel";
  const adminPassword = process.env.ADMIN_PASSWORD || "Yusho@Admin2026";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash: await bcrypt.hash(adminPassword, 12), name: "Yusho Admin" },
    create: {
      name: "Yusho Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12) },
    create: {
      name: "Demo Traveller",
      email: DEMO_EMAIL,
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12),
      phone: "+251 91 234 5678",
      role: "USER",
      profileImage: img("avatar-3"),
    },
  });
  console.log(`✓ Users ready — admin: ${adminEmail} | demo: ${DEMO_EMAIL}`);

  // ── Real customer accounts (featured on the reviews section) ────────────────
  const seedUserPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
  const ribqa = await prisma.user.upsert({
    where: { email: "ribqa.temam@example.com" },
    update: { name: "Ribqa Temam", profileImage: img("ribqatemam") },
    create: {
      name: "Ribqa Temam",
      email: "ribqa.temam@example.com",
      passwordHash: seedUserPassword,
      role: "USER",
      profileImage: img("ribqatemam"),
    },
  });
  const pastor = await prisma.user.upsert({
    where: { email: "pastor.beyene@example.com" },
    update: { name: "Pastor Beyene", profileImage: img("pastorbeyene") },
    create: {
      name: "Pastor Beyene",
      email: "pastor.beyene@example.com",
      passwordHash: seedUserPassword,
      role: "USER",
      profileImage: img("pastorbeyene"),
    },
  });
  const yonas = await prisma.user.upsert({
    where: { email: "yonas.agusha@example.com" },
    update: { name: "Yonas Agusha", profileImage: img("yonasagusha") },
    create: {
      name: "Yonas Agusha",
      email: "yonas.agusha@example.com",
      passwordHash: seedUserPassword,
      role: "USER",
      profileImage: img("yonasagusha"),
    },
  });
  console.log("✓ 3 real customer accounts ready (Ribqa, Pastor, Yonas)");

  // ── Destinations + packages ────────────────────────────────────────────────
  const destByName = new Map<string, { id: string; name: string; slug: string }>();

  for (const d of destinationsData) {
    const { images, packages, ...fields } = d;
    const created = await prisma.destination.create({
      data: {
        ...fields,
        demoSeed: true,
        images: { create: images.map((i) => ({ imageUrl: i.url, altText: i.alt, order: i.order })) },
        packages: { create: packages.map((p) => ({ ...p, demoSeed: true })) },
      },
      select: { id: true, name: true, slug: true },
    });
    destByName.set(d.name, created);
  }
  console.log("✓ 6 destinations + 17 tour packages seeded");

  // ── Events ─────────────────────────────────────────────────────────────────
  for (const e of eventsData) {
    await prisma.event.create({
      data: {
        slug: e.slug,
        title: e.title,
        description: e.description,
        category: e.category,
        date: e.date,
        startTime: e.startTime,
        location: e.location,
        price: e.price,
        capacity: e.capacity,
        image: e.image,
        organizer: e.organizer,
        rules: e.rules,
        status: "UPCOMING", // the date decides whether it displays as past
        availableSeats: e.capacity,
        demoSeed: true,
      },
    });
  }
  console.log("✓ 9 events seeded");

  // ── Demo bookings & workflow sample data ───────────────────────────────────
  const [forty, chamo, dorze] = [
    destByName.get("Forty Springs")!,
    destByName.get("Lake Chamo")!,
    destByName.get("Dorze Village")!,
  ];

  const fortyGroup = await prisma.tourPackage.findFirstOrThrow({
    where: { destinationId: forty.id, name: "Group Day Tour" },
  });
  const chamoPrivate = await prisma.tourPackage.findFirstOrThrow({
    where: { destinationId: chamo.id, name: "Private Boat Safari" },
  });
  const dorzeGroup = await prisma.tourPackage.findFirstOrThrow({
    where: { destinationId: dorze.id, name: "Group Cultural Day" },
  });

  await prisma.booking.create({
    data: {
      bookingRef: "YS-DEMO-001",
      userId: demo.id,
      destinationId: forty.id,
      packageId: fortyGroup.id,
      date: daysFromNow(-21, 9),
      numberOfPeople: 3,
      mode: "GROUP",
      addOns: JSON.stringify(["lunch"]),
      customerName: "Demo Traveller",
      customerPhone: "+251 91 234 5678",
      customerEmail: DEMO_EMAIL,
      totalPrice: 4000,
      status: "COMPLETED",
    },
  });

  await prisma.booking.create({
    data: {
      bookingRef: "YS-DEMO-002",
      userId: demo.id,
      destinationId: chamo.id,
      packageId: chamoPrivate.id,
      date: daysFromNow(15, 9),
      numberOfPeople: 2,
      mode: "PRIVATE",
      addOns: JSON.stringify(["pickup", "photography"]),
      customerName: "Demo Traveller",
      customerPhone: "+251 91 234 5678",
      customerEmail: DEMO_EMAIL,
      totalPrice: 13700,
      status: "CONFIRMED",
    },
  });

  await prisma.booking.create({
    data: {
      bookingRef: "YS-DEMO-003",
      userId: demo.id,
      destinationId: dorze.id,
      packageId: dorzeGroup.id,
      date: daysFromNow(25, 9),
      numberOfPeople: 4,
      mode: "FAMILY",
      addOns: JSON.stringify(["lunch", "hotel"]),
      customerName: "Demo Traveller",
      customerPhone: "+251 91 234 5678",
      customerEmail: DEMO_EMAIL,
      totalPrice: 7920,
      status: "PENDING",
    },
  });

  const walkEvent = await prisma.event.findUniqueOrThrow({
    where: { slug: "chamo-run-community-walk" },
  });
  await prisma.event.update({
    where: { id: walkEvent.id },
    data: { availableSeats: walkEvent.availableSeats - 2 },
  });
  await prisma.eventBooking.create({
    data: {
      reference: "EV-DEMO-001",
      userId: demo.id,
      eventId: walkEvent.id,
      quantity: 2,
      totalPrice: 300,
      attendeeName: "Demo Traveller",
      attendeePhone: "+251 91 234 5678",
      status: "COMPLETED",
    },
  });

  // ── Featured reviews from real customers ─────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        userId: ribqa.id,
        destinationId: dorze.id,
        rating: 5,
        comment:
          "I came along for the YO Masqala event — a trip for Masqala, Dorsso and Dorze with a great group of people. The food, the hikes and the company were all brilliant, and I went home with new friends and unforgettable photos.",
        approved: true,
        featured: true,
        demoSeed: true,
        createdAt: daysFromNow(-45),
      },
      {
        userId: pastor.id,
        destinationId: dorze.id,
        rating: 5,
        comment:
          "We came to Dorze Village as a family — my wife, our son and me — and we loved it. We even had time to sit with the king and learn about the village. A truly special day that we'll never forget.",
        approved: true,
        featured: true,
        demoSeed: true,
        createdAt: daysFromNow(-38),
      },
      {
        userId: yonas.id,
        destinationId: forty.id,
        rating: 5,
        comment:
          "I travelled with my wife, her mother, her other son and our three kids — seven of us in total. Over three days we visited all six destinations, and we loved every single one. Yusho took care of everything for us.",
        approved: true,
        featured: true,
        demoSeed: true,
        createdAt: daysFromNow(-27),
      },
    ],
  });

  // ── Saved destinations, service sample data ────────────────────────────────
  await prisma.savedDestination.create({
    data: { userId: demo.id, destinationId: destByName.get("Lake Chamo")!.id },
  });
  await prisma.savedDestination.create({
    data: { userId: demo.id, destinationId: destByName.get("Dorze Village")!.id },
  });

  await prisma.studentService.create({
    data: {
      userId: demo.id,
      package: "YUSHO_COMPLETE",
      fullName: "Demo Traveller",
      phone: "+251 91 234 5678",
      email: DEMO_EMAIL,
      arrivalDate: daysFromNow(20, 10),
      arrivalLocation: "Arba Minch Airport",
      numberOfFamilyMembers: 4,
      hotelRequired: true,
      tourRequired: true,
      registrationAssistance: true,
      dormitoryAssistance: true,
      notes: "[Demo request] Sample data — a family arriving for the new semester.",
      status: "PENDING",
    },
  });

  await prisma.privateTourRequest.create({
    data: {
      userId: demo.id,
      name: "Demo Traveller",
      phone: "+251 91 234 5678",
      email: DEMO_EMAIL,
      numberOfPeople: 4,
      preferredDate: daysFromNow(30, 8),
      preferredEndDate: daysFromNow(34, 8),
      destinations: JSON.stringify(["Lake Chamo", "Dorze Village"]),
      transportPreference: "Private vehicle for the tour",
      hotelRequired: true,
      foodRequired: true,
      specialRequests: "Good vegetarian options please.",
      budgetRange: "ETB 10,000 – 25,000",
      status: "PENDING",
    },
  });

  console.log("✓ Demo bookings, saved destinations & requests seeded");
  console.log("");
  console.log("Seed complete:");
  console.log(`  Admin dashboard → ${adminEmail} / ${adminPassword}`);
  console.log(`  Demo account    → ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
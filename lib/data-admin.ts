import { prisma } from "@/lib/db";

export async function getAdminDashboardStats() {
  const now = new Date();
  const [
    totalUsers,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    eventBookingsPending,
    revenue,
    upcomingTours,
    upcomingEvents,
    studentServices,
    privateTours,
    reviewsPending,
    totalMessages,
    newMessages,
    totalDestinations,
    totalEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.eventBooking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.count({
      where: { date: { gte: now }, status: { in: ["PENDING", "CONFIRMED"] } },
    }),
    prisma.event.count({
      where: { date: { gte: now }, status: { notIn: ["CANCELLED", "DRAFT"] } },
    }),
    prisma.studentService.count({ where: { status: { notIn: ["DONE", "DECLINED"] } } }),
    prisma.privateTourRequest.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { approved: false } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.destination.count(),
    prisma.event.count(),
  ]);

  return {
    totalUsers,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    eventBookingsPending,
    revenue: revenue._sum.totalPrice ?? 0,
    upcomingTours,
    upcomingEvents,
    studentServices,
    privateTours,
    reviewsPending,
    totalMessages,
    newMessages,
    totalDestinations,
    totalEvents,
  };
}

export async function getRecentActivity(limit = 8) {
  const [bookings, services, messages, privateTours] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true } },
        destination: { select: { name: true } },
      },
    }),
    prisma.studentService.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, fullName: true, package: true, status: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.privateTourRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, name: true, createdAt: true, status: true, budgetRange: true },
    }),
  ]);
  return { bookings, services, messages, privateTours };
}

export async function getAdminBookings(opts: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: "tour" | "event";
  search?: string;
}) {
  const { page = 1, pageSize = 20, status, type = "tour", search } = opts;
  const skip = (page - 1) * pageSize;

  if (type === "event") {
    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { reference: { contains: search } },
        { attendeeName: { contains: search } },
        { event: { title: { contains: search } } },
      ];
    }
    const total = await prisma.eventBooking.count({ where });
    const rows = await prisma.eventBooking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip,
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { title: true, slug: true, date: true, price: true } },
      },
    });
    return { rows, total, page, pages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { bookingRef: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
      { user: { name: { contains: search } } },
      { destination: { name: { contains: search } } },
    ];
  }
  const total = await prisma.booking.count({ where });
  const rows = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip,
    include: {
      user: { select: { name: true, email: true } },
      destination: { select: { name: true, slug: true } },
      package: { select: { name: true } },
    },
  });
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / pageSize)) };
}
export async function getAdminReviews(filter: "all" | "pending" | "approved" = "all") {
  const where: Record<string, unknown> = {};
  if (filter === "pending") where.approved = false;
  if (filter === "approved") where.approved = true;
  return prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, name: true, email: true, profileImage: true } },
      destination: { select: { name: true, slug: true } },
      event: { select: { title: true, slug: true } },
      booking: { select: { bookingRef: true } },
    },
  });
}

export async function getAdminMessages(status: "NEW" | "READ" | "HANDLED" | "all" = "all") {
  const where: Record<string, unknown> = {};
  if (status !== "all") where.status = status;
  return prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAdminCustomers(search?: string) {
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }
  const rows = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true, reviews: true, eventBookings: true } },
    },
  });
  const total = await prisma.user.count({ where });
  return { rows, total };
}

export async function getAdminStudentServices() {
  return prisma.studentService.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function getAdminPrivateTours() {
  return prisma.privateTourRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function getAdminGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export async function getAdminDestinations() {
  return prisma.destination.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      packages: { orderBy: { price: "asc" } },
      _count: { select: { bookings: true } },
    },
  });
}

export async function getAdminEvents() {
  return prisma.event.findMany({
    orderBy: { date: "desc" },
    take: 200,
    include: { _count: { select: { bookings: true } } },
  });
}
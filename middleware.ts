import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/constants";

function key() {
  return new TextEncoder().encode(process.env.SESSION_SECRET || "yusho-dev-insecure-secret-change-me");
}

type Session = { role?: string } | null;

async function readSession(req: NextRequest): Promise<Session> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return { role: typeof payload.role === "string" ? payload.role : "USER" };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await readSession(req);

  const needsAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/account") || pathname === "/book";

  if (!session) {
    if (needsAuth && pathname !== "/login" && pathname !== "/register") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Authenticated — protect admin area by role.
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  // Signed-in users don't need the auth pages.
  if ((pathname === "/login" || pathname === "/register") && session.role) {
    const next = req.nextUrl.searchParams.get("next");
    const url = req.nextUrl.clone();
    url.pathname = next?.startsWith("/") ? next : "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/book", "/login", "/register"],
};
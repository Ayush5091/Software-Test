import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const ROUTE_ROLES = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/trainer", roles: ["trainer"] },
  { prefix: "/dashboard", roles: ["member", "trainer", "admin"] },
  { prefix: "/bookings", roles: ["member", "trainer", "admin"] },
  { prefix: "/progress", roles: ["member", "trainer", "admin"] }
];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const rule = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const token = req.cookies.get("fitbook_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!rule.roles.includes(payload.role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/trainer/:path*", "/dashboard/:path*", "/bookings/:path*", "/progress/:path*"]
};

import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const cookies = req.cookies.get("token")
  const isPublicRoute = publicRoutes.includes(url);
  const isNext = url.startsWith("/_next");

  if (!isPublicRoute && !cookies && !isNext) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

const publicRoutes = ["/api/auth", "/login", "/"];

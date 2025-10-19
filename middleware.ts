import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppJWTPayload, getSession } from "./entities/auth/_vm/session";

export async function middleware(request: NextRequest) {
  const worker_secret = process.env.WORKER_SECRET;
  if (request.headers.get("x-worker-secret") === worker_secret) {
    return NextResponse.next();
  }
  if (
    // request.nextUrl.pathname === "/api/test" ||
    request.nextUrl.pathname === "/api/auth"
  ) {
    return NextResponse.next();
  }
  const session: AppJWTPayload | null = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/registration", "/game/:path*", "/api/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppJWTPayload, getSession } from "./entities/auth/_vm/session";

export async function proxy(request: NextRequest) {
  if (request.headers.get("x-worker-secret") === process.env.WORKER_SECRET) {
    return NextResponse.next();
  }
  if (
    // request.nextUrl.pathname === "/api/test" ||
    request.nextUrl.pathname === "/api/auth"
  ) {
    return NextResponse.next();
  }
  const session: AppJWTPayload | null = await getSession();
  if (!session) return NextResponse.redirect(new URL("/", request.url));

  const response = NextResponse.next();

  if (session.user.lang) response.headers.set("x-user-language", session.user.lang);
  if (request.nextUrl.pathname.startsWith("/api")) response.headers.set("x-user-id", session.user.userId);

  return response;
}

export const config = {
  matcher: ["/registration", "/game/:path*", "/api/:path*"],
};

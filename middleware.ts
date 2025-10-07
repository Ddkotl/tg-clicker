import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "./utils/session";

export async function middleware(request: NextRequest) {
  if (
    // request.nextUrl.pathname === "/api/test" ||
    request.nextUrl.pathname === "/api/auth"
  ) {
    return NextResponse.next();
  }
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/registration", "/game/:path*", "/api/:path*"],
};

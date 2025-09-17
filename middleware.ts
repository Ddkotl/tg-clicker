import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "./utils/session";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/game")) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/game/:path*", "/api/:path*"],
};

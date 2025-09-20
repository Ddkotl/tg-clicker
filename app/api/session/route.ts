import { getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { AppJWTPayload } from "../auth/route";

export type SessionResponse = { isAuthenticated: true; session: AppJWTPayload } | { isAuthenticated: false };

export async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json<SessionResponse>({
      isAuthenticated: true,
      session: session,
    });
  } else {
    return NextResponse.json<SessionResponse>({ isAuthenticated: false }, { status: 401 });
  }
}

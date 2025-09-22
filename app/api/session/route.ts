import { serializeBigInts } from "@/utils/serialize_bigint";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";

export type SessionResponse = { isAuthenticated: true; session: AppJWTPayload } | { isAuthenticated: false };

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    return NextResponse.json<SessionResponse>({
      isAuthenticated: true,
      session: serializeBigInts(session),
    });
  } else {
    return NextResponse.json<SessionResponse>({ isAuthenticated: false }, { status: 401 });
  }
}

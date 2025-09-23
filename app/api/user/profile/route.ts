import { getUserProfileByTgId } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    const profile = await getUserProfileByTgId(session.user.telegram_id);
    if (profile) {
      return NextResponse.json({ profile: profile });
    } else {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
  } else {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}

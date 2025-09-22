import { getUserByTgId } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    const user = await getUserByTgId(session.user.telegram_id);
    if (user) {
      return NextResponse.json({ user: user });
    } else {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
  } else {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}

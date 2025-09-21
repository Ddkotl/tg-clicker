import { getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { getUserByTgId } from "@/repositories/user_repository";
import { AppJWTPayload } from "../auth/route";
import { User } from "@/prisma/_generated/prisma";

export type UserResponse = { user: User } | { isAuthenticated: false };

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    const user = await getUserByTgId(session.user.telegram_id);
    if (user) {
      return NextResponse.json<UserResponse>({ user });
    } else {
      return NextResponse.json<UserResponse>({ isAuthenticated: false }, { status: 401 });
    }
  } else {
    return NextResponse.json<UserResponse>({ isAuthenticated: false }, { status: 401 });
  }
}

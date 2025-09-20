import { getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { User } from "@/app/generated/prisma";
import { getUserByTgId } from "@/repositories/user_repository";
import { AppJWTPayload } from "../auth/route";

export type UserResponse = { user: User } | { isAuthenticated: false };

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    console.log(session);
    const user = await getUserByTgId(session.user.telegram_id);
    console.log(user);
    if (user) {
      return NextResponse.json<UserResponse>({ user });
    } else {
      return NextResponse.json<UserResponse>({ isAuthenticated: false }, { status: 404 });
    }
  } else {
    return NextResponse.json<UserResponse>({ isAuthenticated: false }, { status: 401 });
  }
}

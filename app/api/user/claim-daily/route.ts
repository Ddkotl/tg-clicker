import { NextResponse } from "next/server";
import { AppJWTPayload, getSession } from "@/utils/session";
import { getUserByTgId, claimDaily } from "@/repositories/user_repository";

export async function POST() {
  const session: AppJWTPayload | null = await getSession();
  if (!session) return NextResponse.json({ error: "Not auth" }, { status: 401 });

  const userDb = await getUserByTgId(session.user.telegram_id);
  if (!userDb) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const res = await claimDaily(userDb.id);
  if (!res.ok) return NextResponse.json({ error: res.message }, { status: 400 });
  return NextResponse.json({ ok: true, reward: res.reward, user: res.user });
}

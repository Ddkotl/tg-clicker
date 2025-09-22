import { NextResponse } from "next/server";
import { getSession } from "@/utils/session";
import { getUserByTgId, upgradePassive } from "@/repositories/user_repository";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not auth" }, { status: 401 });
  const userDb = await getUserByTgId(session.user.telegram_id);
  if (!userDb) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const res = await upgradePassive(userDb.id);
  if (!res.ok) return NextResponse.json({ error: res.message }, { status: 400 });
  return NextResponse.json({ ok: true, added: res.added, cost: res.cost, user: res.user });
}

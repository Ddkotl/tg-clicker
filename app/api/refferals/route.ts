import { getReferrals, getReferrer } from "@/repositories/referral_repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const referrals = getReferrals(userId);
  const referrer = getReferrer(userId);

  return NextResponse.json({ referrals, referrer });
}

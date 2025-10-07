import { NextResponse } from "next/server";

export async function POST() {
  console.log("✅ /api/test received POST");
  return NextResponse.json({ ok: true });
}

import { getSession } from "@/utils/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json({ isAuthenticated: true, session: session });
  } else {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}

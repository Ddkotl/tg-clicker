import { NextRequest, NextResponse } from "next/server";
import { dataBase } from "@/utils/db_connect";

export async function GET(req: NextRequest) {
  try {
    const nickname = req.nextUrl.searchParams.get("nickname");
    if (!nickname) return NextResponse.json({ available: false });

    const exists = await dataBase.user.findFirst({ where: { profile: { nikname: nickname } } });

    return NextResponse.json({ available: !exists });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}

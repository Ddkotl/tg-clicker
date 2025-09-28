import { NextRequest, NextResponse } from "next/server";
import { dataBase } from "@/utils/db_connect";
import { z } from "zod";

const nicknameSchema = z.object({
  nickname: z.string().min(3, "Nickname is required"),
});

export async function GET(req: NextRequest) {
  try {
    const nickname = req.nextUrl.searchParams.get("nickname");
    const parsed = nicknameSchema.safeParse({ nickname });
    if (!parsed.success) {
      return NextResponse.json(
        { available: false, error: parsed.error.issues },
        { status: 400 },
      );
    }

    const exists = await dataBase.user.findFirst({
      where: { profile: { nikname: parsed.data.nickname } },
    });

    return NextResponse.json({ available: !exists });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}

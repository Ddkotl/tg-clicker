import {
  checkNicknameerrorResponseSchema,
  CheckNicknameErrorResponseType,
  checkNicknameRequestSchema,
  checkNicknameResponseSchema,
  CheckNicknameResponseType,
} from "@/entities/auth";
import { dataBase } from "@/shared/connect/db_connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const nickname = req.nextUrl.searchParams.get("nickname");
    const parsed = checkNicknameRequestSchema.safeParse({ nickname });

    if (!parsed.success) {
      const errorResponse: CheckNicknameErrorResponseType = {
        data: {},
        message: parsed.error.issues[0]?.message ?? "Invalid nickname format",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const exists = await dataBase.user.findFirst({
      where: { profile: { nikname: parsed.data.nickname } },
    });

    const response: CheckNicknameResponseType = {
      data: { available: !exists },
      message: "ok",
    };

    checkNicknameResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /user/check/nickname error:", error);

    const errorResponse: CheckNicknameErrorResponseType = {
      data: {},
      message: "Internal server error",
    };

    checkNicknameerrorResponseSchema.parse(errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { dataBase } from "@/utils/db_connect";
import { z } from "zod";

const querySchema = z.object({
  nickname: z
    .string()
    .min(3, "Nickname must be at least 3 characters long")
    .max(20, "Nickname must be at most 20 characters long")
    .regex(
      /^[а-яА-Яa-zA-Z0-9_]+$/,
      "Nickname can only contain letters, numbers, and underscores",
    ),
});

const nicknameResponseSchema = z.object({
  data: z.object({
    available: z.boolean(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export type NicknameResponse = z.infer<typeof nicknameResponseSchema>;
export type NicknameErrorResponse = z.infer<typeof errorResponseSchema>;

export async function GET(req: NextRequest) {
  try {
    const nickname = req.nextUrl.searchParams.get("nickname");
    const parsed = querySchema.safeParse({ nickname });

    if (!parsed.success) {
      const errorResponse: NicknameErrorResponse = {
        data: {},
        message: parsed.error.issues[0]?.message ?? "Invalid nickname format",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const exists = await dataBase.user.findFirst({
      where: { profile: { nikname: parsed.data.nickname } },
    });

    const response: NicknameResponse = {
      data: { available: !exists },
      message: "ok",
    };

    nicknameResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /user/check/nickname error:", error);

    const errorResponse: NicknameErrorResponse = {
      data: {},
      message: "Internal server error",
    };

    errorResponseSchema.parse(errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

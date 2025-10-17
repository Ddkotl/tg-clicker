import {
  AppJWTPayload,
  encrypt,
  SESSION_DURATION,
} from "@/entities/auth/_vm/session";
import { validateTelegramWebAppData } from "@/entities/auth/_vm/telegramAuth";
import { UpdateOrCreateUser } from "@/entities/auth/index.server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const authSchema = z.object({
  initData: z.string(),
  ref: z.string().optional(),
});

const authResponseSchema = z.object({
  data: z.object({
    language_code: z.string().optional(),
    nikname: z.string().optional(),
    color_theme: z.string().optional(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export type AuthErrorResponse = z.infer<typeof errorResponseSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = authSchema.safeParse(body);
    console.log("parsedBody", parsedBody);
    if (!parsedBody.success) {
      const response = {
        message: "Invalid request data",
        data: {},
      };
      errorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 400 });
    }
    const { initData, ref } = parsedBody.data;
    const validationResult = validateTelegramWebAppData(initData);
    if (!validationResult.validatedData || !validationResult.user.id) {
      const response = { message: validationResult.message, data: {} };
      errorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }

    const updated_user = await UpdateOrCreateUser(
      {
        ...validationResult.user,
        telegram_id: validationResult.user.id,
      },
      ref,
    );

    if (!updated_user) {
      const response = { message: "User not created", data: {} };
      errorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }

    const payload: AppJWTPayload = {
      user: {
        telegram_id: updated_user.telegram_id,
        userId: updated_user.id,
      },
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION / 1000,
    };

    const session = await encrypt(payload);

    const response: AuthResponse = {
      message: "ok",
      data: {
        language_code: updated_user.language_code ?? undefined,
        nikname: updated_user.profile?.nikname ?? undefined,
        color_theme: updated_user.profile?.color_theme ?? undefined,
      },
    };
    authResponseSchema.parse(response);

    const res = NextResponse.json(response);
    res.cookies.set({
      name: "session",
      value: session,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res;
  } catch (error) {
    console.error("POST /auth error:", error);
    const response: AuthErrorResponse = {
      message: "Internal server error",
      data: {},
    };
    errorResponseSchema.parse(response);
    return NextResponse.json(response, { status: 500 });
  }
}

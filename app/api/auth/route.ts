import { NextRequest, NextResponse } from "next/server";
import { UpdateOrCreateUser } from "@/entities/auth/_repositories/user_repository";
import { validateTelegramWebAppData } from "@/shared/utils/telegramAuth";
import {
  AppJWTPayload,
  encrypt,
  SESSION_DURATION,
} from "@/shared/utils/session";
import {
  AuthErrorResponseType,
  authRequestSchema,
  authResponseSchema,
  AuthResponseType,
} from "@/entities/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = authRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      const response = {
        message: "Invalid request data",
        data: {},
      };
      return NextResponse.json(response, { status: 400 });
    }
    const { initData, ref } = parsedBody.data;
    const validationResult = validateTelegramWebAppData(initData);
    if (!validationResult.validatedData || !validationResult.user.id) {
      const response = { message: validationResult.message, data: {} };
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

    const response: AuthResponseType = {
      message: "Successfully auth",
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
    const response: AuthErrorResponseType = {
      message: "Internal server error",
      data: {},
    };
    return NextResponse.json(response, { status: 500 });
  }
}

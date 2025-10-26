import {
  AuthErrorResponseType,
  authRequestSchema,
  authResponseSchema,
  AuthResponseType,
  errorResponseSchema,
} from "@/entities/auth";
import { AppJWTPayload, encrypt, SESSION_DURATION } from "@/entities/auth/_vm/session";
import { validateTelegramWebAppData } from "@/entities/auth/_vm/telegramAuth";
import { UpdateOrCreateUser } from "@/entities/auth/index.server";
import { deleteOldFacts } from "@/entities/facts/index.server";
import { recalcHp } from "@/features/hp_regen/recalc_hp";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = authRequestSchema.safeParse(body);
    if (!parsedBody.success) return makeError("Invalid request data", 400);

    const { initData, ref } = parsedBody.data;
    const validationResult = validateTelegramWebAppData(initData);
    if (!validationResult.validatedData || !validationResult.user.id) return makeError(validationResult.message, 401);

    const updated_user = await UpdateOrCreateUser(
      {
        ...validationResult.user,
        telegram_id: validationResult.user.id,
      },
      ref,
    );

    if (!updated_user) return makeError("User not created", 401);

    const hp = await recalcHp(updated_user.id);
    if (hp === null) return makeError("recalcHp error", 400);
    const deleted_facts_count = await deleteOldFacts(updated_user.id);
    if (deleted_facts_count === null) return makeError("deleteOldFacts error", 400);

    const payload: AppJWTPayload = {
      user: {
        telegram_id: updated_user.telegram_id,
        userId: updated_user.id,
      },
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION / 1000,
    };

    const session = await encrypt(payload);

    const response: AuthResponseType = {
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
    const response: AuthErrorResponseType = {
      message: "Internal server error",
      data: {},
    };
    errorResponseSchema.parse(response);
    return NextResponse.json(response, { status: 500 });
  }
}

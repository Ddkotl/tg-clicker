import { authRequestSchema, authResponseSchema, AuthResponseType } from "@/entities/auth";
import { AppJWTPayload, encrypt, SESSION_DURATION } from "@/entities/auth/_vm/session";
import { validateTelegramWebAppData } from "@/entities/auth/_vm/telegramAuth";
import { authService } from "@/features/auth/services/auth_servise";
import { translate } from "@/features/translations/server/translate_fn";
import { SupportedLang } from "@/features/translations/translate_type";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { rateLimitRedis } from "@/shared/lib/redis_limiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = authRequestSchema.safeParse(body);
    if (!parsedBody.success) return makeError("Invalid request data", 400);
    const { initData, ref } = parsedBody.data;
    const validationResult = validateTelegramWebAppData(initData);
    if (!validationResult.validatedData || !validationResult.user.id) return makeError(validationResult.message, 401);
    const lang = validationResult.user.language_code === "ru" ? "ru" : ("en" as SupportedLang);
    const telegram_id = validationResult.user.id;

    const { allowed } = await rateLimitRedis(`rl:auth:${telegram_id}`, 10, 60);
    if (!allowed) return makeError(translate("api.rate_limit_exceeded", lang), 429);

    const updated_user = await authService.authenticateUser({ lang, validationResult, referer_id: ref });
    if (!updated_user) return makeError(translate("api.invalid_registration_user", lang), 401);
    const payload: AppJWTPayload = {
      user: {
        telegram_id: updated_user.telegram_id,
        userId: updated_user.id,
        lang: lang,
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
      type: "success",
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
    return makeError(translate("api.internal_server_error", "en"), 500);
  }
}

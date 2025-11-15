import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { fightService } from "@/features/fights/servises/fight_servise";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { NextResponse } from "next/server";
import { fightResponseSchema, CreateFightResponseType } from "@/entities/fights";

export async function POST(req: Request) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const userId = getCookieUserId({ headers: req.headers });
    if (!userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }

    const result = await fightService.atack(userId);
    if (!result || result === null) return makeError(translate("api.invalid_process", lang), 400);
    const response: CreateFightResponseType = {
      ok: true,
      message: "Fight started",
      data: result,
    };
    fightResponseSchema.parse(response);
    return NextResponse.json(result);
  } catch (e) {
    console.error("startFight error", e);
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}

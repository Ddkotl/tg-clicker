import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { NextResponse } from "next/server";
import { fightResponseSchema, FightResponseType } from "@/entities/fights";
import { fightRepository } from "@/entities/fights/index.server";

export async function GET(req: Request) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const userId = getCookieUserId({ headers: req.headers });
    if (!userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }

    const result = await fightRepository.getPendingFightByAtackserId({ attackserId: userId });
    if (!result || result === null) return makeError(translate("api.invalid_process", lang), 400);
    const response: FightResponseType = {
      ok: true,
      message: "Fight started",
      data: result,
    };
    fightResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (e) {
    console.error("startFight error", e);
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}

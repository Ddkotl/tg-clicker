import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { NextRequest, NextResponse } from "next/server";
import { fightResponseSchema, FightResponseType } from "@/entities/fights";
import { EnemyType, FightStatus, FightType } from "@/_generated/prisma/enums";
import { fightService } from "@/features/fights/_servises/fight_servise";

export async function GET(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const fightId = searchParams.get("fightId");
    const enemyType = searchParams.get("enemyType");

    const userId = getCookieUserId({ headers: req.headers });
    if (!userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }
    let result = null;
    if (status) {
      result = await fightService.getOrRefreshPendingFight({
        attackserId: userId,
        status: status as FightStatus,
        lang: lang,
      });
      if (!result || result === null) {
        if (!enemyType) {
          return makeError(translate("api.invalid_request_data", lang), 400);
        }
        result = await fightService.startFight({
          userId: userId,
          enemyType: enemyType as EnemyType,
          fightType: enemyType === EnemyType.PLAYER ? FightType.PVP : FightType.PVE,
          lang: lang,
        });
      }
    }
    if (fightId) result = await fightService.getFinidhedFight({ fightId: fightId });

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

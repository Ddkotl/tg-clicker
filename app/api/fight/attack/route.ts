import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { NextResponse } from "next/server";
import { FightLog, fightResponseSchema, FightResponseType, FightResRewards } from "@/entities/fights";
import { fightService } from "@/features/fights/_servises/fight_servise";
import { FightResult, MissionType } from "@/_generated/prisma";
import { missionService } from "@/features/missions/servisces/mission_service";
import { fight_missions } from "@/shared/game_config/missions/missions_lists";
import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { pushToSubscriber } from "@/shared/connect/redis_connect";

export async function POST(req: Request) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const userId = getCookieUserId({ headers: req.headers });
    if (!userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }

    const atack_result = await fightService.atack({ userId: userId, lang: lang });
    const rewards = atack_result.finished_fight.rewards as FightResRewards;
    if (!atack_result || !rewards) return makeError(translate("api.invalid_process", lang), 400);
    await pushToSubscriber(userId, atack_result.fact.type);

    const completed_missions = [];
    let progress = 0;

    for (const mission of fight_missions) {
      if (mission === MissionType.FIGHTS_WINS) {
        progress = atack_result.finished_fight.result === FightResult.WIN ? 1 : 0;
      }
      if (mission === MissionType.GET_GLORY) {
        progress = atack_result.finished_fight.result === FightResult.WIN ? (rewards.glory ?? 0) : 0;
      }
      if (mission === MissionType.DAMAGE) {
        progress = (atack_result.finished_fight.fightLog as FightLog)
          .filter((log) => log.attacker === "player")
          .reduce((acc, el) => acc + el.damage, 0);
      }
      if (mission === MissionType.ROBBERY_QI_ENERGY) {
        progress = atack_result.finished_fight.result === FightResult.WIN ? (rewards.qi ?? 0) : 0;
      }
      const win_fights_mission = await missionService.updateMissionAndFinish({
        userId: userId,
        mission_type: MissionType[mission],
        progress: progress,
      });
      if (win_fights_mission?.is_completed && !win_fights_mission?.is_active) {
        completed_missions.push(win_fights_mission);
      }
    }

    await CheckUpdateLvl(userId);
    const response: FightResponseType = {
      ok: true,
      message: "Fight started",
      data: atack_result.finished_fight,
    };
    fightResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (e) {
    console.error("startFight error", e);
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}

import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { NextResponse } from "next/server";
import { fightResponseSchema, FightResponseType, FightResRewards } from "@/entities/fights";
import { fightService } from "@/features/fights/_servises/fight_servise";
import { pushToSubscriber } from "../../user/facts/stream/route";
import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { GetResources } from "@/entities/profile/index.server";
import { InactivateMission, UpdateProgressMission } from "@/entities/missions/index.server";
import { createFact } from "@/entities/facts/index.server";
import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";

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
    // const completed_missions = [];
    // const mine_mission = await UpdateProgressMission(userId, MissionType.MINE, 1);
    // if (mine_mission?.is_completed && mine_mission?.is_active) {
    //   await GetResources({
    //     userId,
    //     qi: mine_mission.reward_qi,
    //     qi_stone: mine_mission.reward_qi_stone,
    //     spirit_cristal: mine_mission.reward_spirit_cristal,
    //     glory: mine_mission.reward_glory,
    //     exp: mine_mission.reward_exp,
    //   });

    //   await createFact({
    //     userId,
    //     fact_status: FactsStatus.NO_CHECKED,
    //     fact_type: FactsType.MISSION,
    //     exp_reward: mine_mission.reward_exp,
    //     qi_reward: mine_mission.reward_qi,
    //     reward_spirit_cristal: mine_mission.reward_spirit_cristal,
    //     qi_stone_reward: mine_mission.reward_qi_stone,
    //     reward_glory: mine_mission.reward_glory,
    //     target: mine_mission.target_value,
    //     mission_type: mine_mission.type,
    //   });
    //   await InactivateMission(mine_mission.userId, mine_mission.type);
    //   completed_missions.push(mine_mission);
    // }

    // const lvl = await CheckUpdateLvl(userId);
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

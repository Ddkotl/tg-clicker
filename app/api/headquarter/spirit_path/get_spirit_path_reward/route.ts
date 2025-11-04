import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { createFact } from "@/entities/facts/index.server";
import { GetResources, InactivateMission, UpdateProgressMission } from "@/entities/missions/index.server";
import {
  getSpiritPathRewardRequestSchema,
  getSpiritPathRewardResponseSchema,
  GetSpiritPathRewardResponseType,
} from "@/entities/spirit_path";
import { giveSpiritPathReward } from "@/entities/spirit_path/_repositories/give_spirit_path_reward";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const lang = getCookieLang(request);
  try {
    const body = await request.json();
    const parsed = getSpiritPathRewardRequestSchema.safeParse(body);
    if (!parsed.success) return makeError(translate("api.invalid_request_data", lang), 400);

    const { userId, break_spirit_path } = parsed.data;
    const res = await giveSpiritPathReward(userId, break_spirit_path);
    if (!res || res === null) return makeError("Invalid request data", 400);
    const new_fact = await createFact({
      fact_type: FactsType.SPIRIT_PATH,
      fact_status: FactsStatus.NO_CHECKED,
      userId: userId,
      active_minutes: res?.minutes,
      exp_reward: res?.reward_exp,
      qi_reward: res?.reward_qi,
      reward_spirit_cristal: res.reward_spirit_cristal,
    });
    if (new_fact !== null) {
      await pushToSubscriber(userId, new_fact.type);
    }
    const completed_missions = [];
    const spirit_path_mission = await UpdateProgressMission(
      userId,
      MissionType.SPIRIT_PATH,
      break_spirit_path ? 0 : res.minutes,
    );
    if (spirit_path_mission?.is_completed && spirit_path_mission?.is_active) {
      await GetResources({
        userId,
        qi: spirit_path_mission.reward_qi,
        qi_stone: spirit_path_mission.reward_qi_stone,
        spirit_cristal: spirit_path_mission.reward_spirit_cristal,
        glory: spirit_path_mission.reward_glory,
        exp: spirit_path_mission.reward_exp,
      });
      await createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: spirit_path_mission.reward_exp,
        qi_reward: spirit_path_mission.reward_qi,
        reward_spirit_cristal: spirit_path_mission.reward_spirit_cristal,
        qi_stone_reward: spirit_path_mission.reward_qi_stone,
        reward_glory: spirit_path_mission.reward_glory,
        target: spirit_path_mission.target_value,
        mission_type: spirit_path_mission.type,
      });
      await InactivateMission(spirit_path_mission.userId, spirit_path_mission.type);
      completed_missions.push(spirit_path_mission);
    }
    const response: GetSpiritPathRewardResponseType = {
      data: {
        ...res,
        missions: completed_missions,
      },
      type: "success",
      message: translate("api.reward_successfully_received", lang),
    };
    getSpiritPathRewardResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation/get_meditation_reward error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

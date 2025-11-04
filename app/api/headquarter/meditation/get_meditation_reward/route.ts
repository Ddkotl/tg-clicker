import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { createFact } from "@/entities/facts/index.server";
import { GetMeditationRewardResponseType } from "@/entities/meditation";
import {
  getMeditationRewardRequestSchema,
  getMeditationRewardResponseSchema,
} from "@/entities/meditation/_domain/schemas";
import { giveMeditationReward } from "@/entities/meditation/index.server";
import { GetResources, InactivateMission, UpdateProgressMission } from "@/entities/missions/index.server";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = getMeditationRewardRequestSchema.safeParse(body);
    if (!parsed.success) return makeError("Invalid request data", 400);

    const { userId, break_meditation } = parsed.data;
    const res = await giveMeditationReward(userId, break_meditation);
    if (!res || res === null) return makeError("Invalid request data", 400);
    const new_fact = await createFact({
      fact_type: FactsType.MEDITATION,
      fact_status: FactsStatus.NO_CHECKED,
      userId: userId,
      active_hours: res?.hours,
      exp_reward: res?.reward_exp,
      qi_reward: res?.reward_qi,
    });
    if (new_fact !== null) {
      await pushToSubscriber(userId, new_fact.type);
    }
    const completed_missions = [];
    const meditation_mission = await UpdateProgressMission(userId, MissionType.MEDITATION, res.hours);
    if (meditation_mission?.is_completed && meditation_mission?.is_active) {
      await GetResources({
        userId,
        qi: meditation_mission.reward_qi,
        qi_stone: meditation_mission.reward_qi_stone,
        spirit_cristal: meditation_mission.reward_spirit_cristal,
        glory: meditation_mission.reward_glory,
        exp: meditation_mission.reward_exp,
      });
      await createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: meditation_mission.reward_exp,
        qi_reward: meditation_mission.reward_qi,
        reward_spirit_cristal: meditation_mission.reward_spirit_cristal,
        qi_stone_reward: meditation_mission.reward_qi_stone,
        reward_glory: meditation_mission.reward_glory,
        target: meditation_mission.target_value,
        mission_type: meditation_mission.type,
      });
      await InactivateMission(meditation_mission.userId, meditation_mission.type);
      completed_missions.push(meditation_mission);
    }
    const response: GetMeditationRewardResponseType = {
      data: {
        ...res,
        missions: completed_missions,
      },
      type: "success",
      message: "getMeditationReward updated successfully",
    };
    getMeditationRewardResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation/get_meditation_reward error:", error);
    return makeError("Internal server error", 500);
  }
}

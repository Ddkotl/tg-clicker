import { FactsStatus, FactsType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { createFact } from "@/entities/facts/index.server";
import { GetMeditationRewardErrorResponseType, GetMeditationRewardResponseType } from "@/entities/meditation";
import {
  getMeditationRewardErrorResponseSchema,
  getMeditationRewardRequestSchema,
  getMeditationRewardResponseSchema,
} from "@/entities/meditation/_domain/schemas";
import { giveMeditationReward } from "@/entities/meditation/index.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = getMeditationRewardRequestSchema.safeParse(body);
    if (!parsed.success) {
      const errorResponse: GetMeditationRewardErrorResponseType = {
        data: {},
        message: "Invalid request data",
        type: "error",
      };
      getMeditationRewardErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const { userId } = parsed.data;
    const res = await giveMeditationReward(userId);
    const new_fact = await createFact({
      fact_type: FactsType.MEDITATION,
      fact_status: FactsStatus.NO_CHECKED,
      userId: userId,
      active_hours: res?.hours,
      exp_reward: res?.reward_exp,
      mana_reward: res?.reward_mana,
    });
    if (new_fact !== null) {
      pushToSubscriber(userId, new_fact.type);
    }
    if (!res) {
      const errorResponse: GetMeditationRewardErrorResponseType = {
        data: {},
        type: "error",
        message: "not reward",
      };
      getMeditationRewardErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const response: GetMeditationRewardResponseType = {
      data: {
        ...res,
      },
      type: "success",
      message: "getMeditationReward updated successfully",
    };
    getMeditationRewardResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation/get_meditation_reward error:", error);
    const errorResponse: GetMeditationRewardErrorResponseType = {
      data: {},
      type: "error",
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

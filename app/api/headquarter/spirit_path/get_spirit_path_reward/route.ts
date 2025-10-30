import { FactsStatus, FactsType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { createFact } from "@/entities/facts/index.server";
import { GetMeditationRewardResponseType } from "@/entities/meditation";
import {
  getMeditationRewardRequestSchema,
  getMeditationRewardResponseSchema,
} from "@/entities/meditation/_domain/schemas";
import { giveMeditationReward } from "@/entities/meditation/index.server";
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
    return makeError("Internal server error", 500);
  }
}

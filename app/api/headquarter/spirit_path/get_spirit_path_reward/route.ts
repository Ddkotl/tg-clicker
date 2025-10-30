import { FactsStatus, FactsType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { createFact } from "@/entities/facts/index.server";
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

    const response: GetSpiritPathRewardResponseType = {
      data: {
        ...res,
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

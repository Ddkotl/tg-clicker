import { GetMeditationRewardResponseType } from "@/entities/meditation";
import {
  getMeditationRewardRequestSchema,
  getMeditationRewardResponseSchema,
} from "@/entities/meditation/_domain/schemas";
import { MeditationRewardService } from "@/features/meditation/services/meditation_reward_service";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const headers = await request.headers;
  const lang = await getCookieLang({ headers });
  try {
    const body = await request.json();
    const parsed = getMeditationRewardRequestSchema.safeParse(body);
    if (!parsed.success) return makeError("Invalid request data", 400);

    const { userId, break_meditation } = parsed.data;
    const { res, completed_missions, lvl } = await MeditationRewardService(userId, break_meditation);
    if (!res || res === null) return makeError(translate("api.invalid_process", lang), 400);

    const response: GetMeditationRewardResponseType = {
      data: {
        ...res,
        missions: completed_missions,
        current_lvl: lvl ? lvl : res.current_lvl,
      },
      type: "success",
      message: translate("api.reward_successfully_received", lang),
    };
    getMeditationRewardResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation/get_meditation_reward error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

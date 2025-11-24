import { GetMeditationRewardResponseType } from "@/entities/meditation";
import {
  getMeditationRewardRequestSchema,
  getMeditationRewardResponseSchema,
} from "@/entities/meditation/_domain/schemas";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { MeditationRewardService } from "@/features/meditation/services/meditation_reward_service";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const headers = request.headers;
  const lang = getCookieLang({ headers });
  const userIdCookie = getCookieUserId({ headers });
  try {
    const body = await request.json();
    const parsed = getMeditationRewardRequestSchema.safeParse(body);
    if (!parsed.success) return makeError(translate("api.invalid_request_data", lang), 400);
    const { userId, break_meditation } = parsed.data;
    if (!userIdCookie || !userId || userIdCookie !== userId) return makeError(translate("api.no_auth", lang), 401);
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

import { checkSubscribeResponseSchema, checkSubscribeSchema } from "@/entities/missions/_domain/schemas";
import { missionRepository } from "@/entities/missions/index.server";
import { userRepository } from "@/entities/user/_repositories/user_repository";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { checkSubscriptions } from "@/features/missions/check_subscriptions";
import { missionService } from "@/features/missions/servisces/mission_service";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { rateLimitRedis } from "@/shared/lib/redis_limiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  const userId = getCookieUserId({ headers: req.headers });
  try {
    if (!userId) return makeError(translate("api.no_auth", lang), 401);
    const { allowed } = await rateLimitRedis(`rl:check_subscribtion:${userId}`, 10, 60);
    if (!allowed) return makeError(translate("api.rate_limit_exceeded", lang), 429);
    const body = await req.json();
    const parsedBody = checkSubscribeSchema.safeParse(body);
    if (!parsedBody.success) return makeError(translate("api.invalid_request_data", lang), 400);
    const { missionId } = parsedBody.data;
    const mission = await missionRepository.getMissionById({ missionId });
    if (!mission) return makeError(translate("api.info_not_found", lang), 404);
    if (mission.userId !== userId) return makeError(translate("api.no_auth", lang), 401);
    const user = await userRepository.getUserById({ userId });
    if (!user) return makeError(translate("api.no_auth", lang), 401);
    const isSubscribed = await checkSubscriptions({
      chanel_id: mission.chanel_id || "",
      tg_user_id: user.telegram_id || "",
    });
    if (!isSubscribed) {
      return makeError(translate("api.invalid_process", lang), 400);
    }
    const updated_data = await missionService.updateMissionAndFinish({
      missionId: missionId,
      progress: mission.target_value,
    });
    console.log("updated_data", updated_data);
    if (!updated_data) {
      return makeError(translate("api.internal_server_error", lang), 500);
    }

    const response = {
      message: "ok",
      data: {
        userId: userId,
        spirit_cristal: updated_data.updated_profile?.spirit_cristal || 0,
      },
      type: "success",
    };
    checkSubscribeResponseSchema.parse(response);

    const res = NextResponse.json(response);
    return res;
  } catch (err) {
    console.error("❌ /api/user/mission/verify-subscription error", err);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

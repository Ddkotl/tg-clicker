import {
  goMeditationRequestSchema,
  goMeditationResponseSchema,
  goMeditationResponseType,
  MeditationInfoResponse,
  meditationInfoResponseSchema,
} from "@/entities/meditation";
import { calcMeditationReward } from "@/entities/meditation/_vm/calc_meditation_reward";
import { getMeditationInfo, goMeditation } from "@/entities/meditation/index.server";
import { profileRepository } from "@/entities/profile/index.server";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import {
  createRabbitMeditationConnection,
  MEDITATION_EXCHANGE,
  MEDITATION_QUEUE,
} from "@/features/meditation/rabit_meditation_connect";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { calculateMeditationTimeMS } from "@/shared/game_config/miditation/meditation";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  const userId = getCookieUserId({ headers: req.headers });
  try {
    if (!userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }

    const meditation_info = await getMeditationInfo(userId);
    if (!meditation_info || meditation_info === null) {
      return makeError(translate("api.info_not_found", lang), 404);
    }

    const response: MeditationInfoResponse = {
      data: {
        ...meditation_info,
      },
      message: "Meditation info fetched successfully",
    };

    meditationInfoResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/headquarter/meditation error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

export async function POST(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  const cookie_userId = getCookieUserId({ headers: req.headers });
  try {
    const body = await req.json();
    const parsed = goMeditationRequestSchema.safeParse(body);

    if (!parsed.success || cookie_userId !== parsed.data.userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }
    const { userId, hours } = parsed.data;
    const user_params = await profileRepository.getByUserId({ userId });
    if (
      !user_params ||
      user_params.power === undefined ||
      user_params.protection === undefined ||
      user_params.speed === undefined ||
      user_params.skill === undefined ||
      user_params.qi_param === undefined
    ) {
      return makeError(translate("api.info_not_found", lang), 404);
    }
    const meditation_revard = calcMeditationReward({
      power: user_params.power,
      protection: user_params.protection,
      speed: user_params.speed,
      skill: user_params.skill,
      qi_param: user_params.qi_param,
      hours,
    });
    const meditate = await goMeditation(userId, hours, meditation_revard);
    if (!meditate) {
      return makeError(translate("api.invalid_process", lang), 400);
    }
    const delay = calculateMeditationTimeMS(hours);
    const start_meditation = meditate.start_meditation;
    // const delay = hours * 1000;
    const { channel, connection } = await createRabbitMeditationConnection();
    channel.publish(MEDITATION_EXCHANGE, MEDITATION_QUEUE, Buffer.from(JSON.stringify({ userId, start_meditation })), {
      headers: { "x-delay": delay },
      persistent: true,
    });
    await channel.close();
    await connection.close();
    const response: goMeditationResponseType = {
      data: {
        userId: meditate.userId,
        meditation_hours: meditate.meditation_hours,
        on_meditation: meditate.on_meditation,
        start_meditation: meditate.start_meditation,
        meditation_revard: meditate.meditation_revard,
      },
      message: "goMeditation updated successfully",
    };
    goMeditationResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

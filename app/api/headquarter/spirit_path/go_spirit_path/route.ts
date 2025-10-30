import { getUserProfileByUserId } from "@/entities/auth/_repositories/user_repository";
import {
  goSpiritPathRequestSchema,
  goSpiritPathResponseSchema,
  GoSpiritPathResponseType,
} from "@/entities/spirit_path";
import { calcSpiritPathReward } from "@/entities/spirit_path/_vm/calc_spirit_path_reward";
import { goSpiritPath } from "@/entities/spirit_path/index.server";
import {
  createMqSpiritPathConnection,
  SPIRIT_PATH_EXCHANGE,
  SPIRIT_PATH_QUEUE,
} from "@/features/spirit_path/mq_spirit_path_connect";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const body = await req.json();
    const parsed = goSpiritPathRequestSchema.safeParse(body);

    if (!parsed.success) {
      return makeError(translate("api.invalid_request_data", lang), 400);
    }
    const { userId, minutes } = parsed.data;
    const user_params = await getUserProfileByUserId(userId);
    if (
      !user_params ||
      user_params.profile?.power === undefined ||
      user_params.profile?.protection === undefined ||
      user_params.profile?.speed === undefined ||
      user_params.profile?.skill === undefined ||
      user_params.profile?.qi_param === undefined
    ) {
      return makeError(translate("api.info_not_found", lang), 400);
    }
    const spirit_path_reward = calcSpiritPathReward({
      power: user_params.profile.power,
      protection: user_params.profile.protection,
      speed: user_params.profile.speed,
      skill: user_params.profile.skill,
      qi_param: user_params.profile.qi_param,
      minutes,
    });
    const spirit_path = await goSpiritPath(userId, minutes, spirit_path_reward);
    if (!spirit_path || spirit_path === null) {
      return makeError(translate("api.invalid_process", lang), 400);
    }
    const delay = minutes * 60 * 1000;
    const { channel, connection } = await createMqSpiritPathConnection();
    channel.publish(SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE, Buffer.from(JSON.stringify({ userId })), {
      headers: { "x-delay": delay },
      persistent: true,
    });
    await channel.close();
    await connection.close();
    const response: GoSpiritPathResponseType = {
      data: {
        id: spirit_path.id,
        userId: spirit_path.userId,
        on_spirit_paths: spirit_path.on_spirit_paths,
        spirit_paths_minutes: spirit_path.spirit_paths_minutes,
        start_spirit_paths: spirit_path.start_spirit_paths,
        spirit_paths_reward: spirit_path.spirit_paths_reward,
        minutes_today: spirit_path.minutes_today,
        date_today: spirit_path.date_today,
      },
      message: "goMeditation updated successfully",
      type: "success",
    };
    goSpiritPathResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

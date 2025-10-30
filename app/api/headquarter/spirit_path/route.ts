import { spiritPathInfoResponseSchema, SpiritPathInfoResponseType } from "@/entities/spirit_path";
import { getSpiritPathInfo } from "@/entities/spirit_path/index.server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    if (!requestedUserId) {
      return makeError(translate("api.no_auth", lang), 401);
    }

    const spirit_path_info = await getSpiritPathInfo(requestedUserId);
    if (!spirit_path_info || spirit_path_info === null) {
      return makeError(translate("api.info_not_found", lang), 404);
    }

    const response: SpiritPathInfoResponseType = {
      data: {
        id: spirit_path_info.id,
        userId: spirit_path_info.userId,
        on_spirit_paths: spirit_path_info.on_spirit_paths,
        start_spirit_paths: spirit_path_info.start_spirit_paths,
        spirit_paths_minutes: spirit_path_info.spirit_paths_minutes,
        spirit_paths_reward: spirit_path_info.spirit_paths_reward,
        minutes_today: spirit_path_info.minutes_today,
        date_today: spirit_path_info.date_today,
      },
      message: "Meditation info fetched successfully",
      type: "success",
    };

    spiritPathInfoResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/headquarter/meditation error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

import {
  getSpiritPathRewardRequestSchema,
  getSpiritPathRewardResponseSchema,
  GetSpiritPathRewardResponseType,
} from "@/entities/spirit_path";
import { SpiritPathRewardServices } from "@/features/spirit_path/services/spirit_path_reward_services";
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
    const { res, lvl, completed_missions } = await SpiritPathRewardServices(userId, break_spirit_path);
    if (!res || res === null) return makeError(translate("api.invalid_process", lang), 400);

    const response: GetSpiritPathRewardResponseType = {
      data: {
        ...res,
        missions: completed_missions,
        current_lvl: lvl ? lvl : res.current_lvl,
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

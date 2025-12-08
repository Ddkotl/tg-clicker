import {
  getSpiritPathRewardRequestSchema,
  getSpiritPathRewardResponseSchema,
  GetSpiritPathRewardResponseType,
} from "@/entities/spirit_path";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { spiritPathServise } from "@/features/spirit_path/services/spirit_path_servise";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { dataBase } from "@/shared/connect/db_connect";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const lang = getCookieLang({ headers: request.headers }) || "en";
  const userIdCookie = getCookieUserId({ headers: request.headers });
  const workerSecret = request.headers.get("x-worker-secret");

  try {
    const body = await request.json();
    const parsed = getSpiritPathRewardRequestSchema.safeParse(body);
    if (!parsed.success) return makeError(translate("api.invalid_request_data", lang), 400);

    const { userId, break_spirit_path } = parsed.data;
    if (workerSecret) {
      if (workerSecret !== process.env.WORKER_SECRET) {
        return makeError(translate("api.no_auth", lang), 401);
      }
    } else {
      if (!userIdCookie || !userId || userIdCookie !== userId) {
        return makeError(translate("api.no_auth", lang), 401);
      }
    }
    const { res, newLlvl, completed_missions } = await dataBase.$transaction(async (tx) => {
      const { res, newLlvl, completed_missions } = await spiritPathServise.giveSpiritPathReward({
        break_spirit_path: break_spirit_path || false,
        userId,
        tx,
      });
      return { res, newLlvl, completed_missions };
    });

    if (!res || res === null) return makeError(translate("api.invalid_process", lang), 400);

    const response: GetSpiritPathRewardResponseType = {
      data: {
        ...res,
        missions: completed_missions,
        current_lvl: newLlvl,
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

import { userCountInFrResponseSchema, UserCountInFrResponseType } from "@/entities/statistics";
import { statisticRepository } from "@/entities/statistics/index.server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const data = await statisticRepository.getUserCountsInFractions();

    if (!data) {
      return makeError(translate("api.info_not_found", lang), 400);
    }
    const response: UserCountInFrResponseType = {
      data: {
        adepts: data?.adepts_count ?? 0,
        novices: data?.novices_count ?? 0,
      },
      message: "ok",
    };

    userCountInFrResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /statistics/users_count_in_fr error:", error);

    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

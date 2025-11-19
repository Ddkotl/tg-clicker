import { ratingsOverallResponseSchema, RatingUnionSchema, RatingUnionType } from "@/entities/statistics";
import { OverallRatingsMAP, OverallRatingsMAP_Type } from "@/entities/statistics/_domain/ratings_list_items";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: OverallRatingsMAP_Type }> }) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const params_types = (await params).type;
    const handler = OverallRatingsMAP[params_types];
    if (!handler) {
      return makeError(translate("api.info_not_found", lang), 404);
    }

    const raw_data = await handler({});
    const data: RatingUnionType = RatingUnionSchema.parse(raw_data);
    const response = {
      ok: true,
      message: translate("api.success", lang),
      data,
    };
    const validated_res = ratingsOverallResponseSchema.parse(response);

    return Response.json(validated_res, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",

        // 5 минут кэша + 1 минута SWR
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (e) {
    console.error("GET /statistics/rating/[type] error:", e);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

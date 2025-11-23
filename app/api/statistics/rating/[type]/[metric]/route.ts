import { NextRequest } from "next/server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { ratingsResponseSchema, RatingUnionSchema } from "@/entities/statistics";
import {
  ratingMetrics,
  RatingsMetrics,
  RatingsTypes,
  ratingsTypes,
} from "@/entities/statistics/_domain/ratings_list_items";
import { statisticRepository } from "@/entities/statistics/index.server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string; metric: string }> }) {
  const lang = getCookieLang({ headers: req.headers });

  try {
    const rating_type = (await params).type;
    const rating_metric = (await params).metric;
    if (!Object.keys(ratingsTypes).includes(rating_type)) {
      return makeError(translate("api.info_not_found", lang), 404);
    }
    if (!Object.keys(ratingMetrics).includes(rating_metric)) {
      return makeError(translate("api.info_not_found", lang), 404);
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;

    const raw = await statisticRepository.getRating({
      ratingType: rating_type as RatingsTypes,
      metric: rating_metric as RatingsMetrics,
      page,
      pageSize: 10,
    });

    const enriched = {
      rating_type: rating_type,
      rating_metric: rating_metric,
      ...raw,
    };

    const data = RatingUnionSchema.parse(enriched);

    const response = {
      ok: true,
      message: translate("api.success", lang),
      data,
    };

    const validated = ratingsResponseSchema.parse(response);
    return Response.json(validated, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("GET /statistics/rating/[type] error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

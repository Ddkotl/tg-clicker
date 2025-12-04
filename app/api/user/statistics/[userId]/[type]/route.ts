import { NextRequest } from "next/server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { statisticRepository } from "@/entities/statistics/index.server";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";

import { UserStatsRequestParamsSchema, UserStatsResponseSchema } from "@/entities/statistics/_domain/schemas";
import { UserStatsResponse } from "@/entities/statistics/_domain/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string; userId: string }> }) {
  const lang = getCookieLang({ headers: req.headers });
  const sessionUserId = getCookieUserId({ headers: req.headers });
  try {
    const awaited_params = await params;

    const parsed = UserStatsRequestParamsSchema.safeParse(awaited_params);

    if (!parsed.success) {
      return makeError(translate("api.info_not_found", lang), 404);
    }

    const { type, userId } = parsed.data;

    if (sessionUserId !== userId && type !== "overall") {
      return makeError(translate("api.invalid_process", lang), 400);
    }

    const stats = await statisticRepository.getUserStats({
      type,
      userId,
    });

    const response: UserStatsResponse = {
      ok: true,
      message: translate("api.success", lang),
      data: {
        userId,
        type,
        stats,
      },
    };

    const validated = UserStatsResponseSchema.parse(response);

    return Response.json(validated);
  } catch (error) {
    console.error("GET /statistics/user/[type]/[userId] error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

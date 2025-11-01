// /app/api/missions/route.ts
import {
  createDailyMissionsResponseSchema,
  CreateDailyMissionsResponseType,
  getDailyMissionsRequestSchema,
  getDailyMissionsResponseSchema,
  GetDailyMissionsResponseType,
} from "@/entities/missions";
import { getUserDailyMissions } from "@/entities/missions/_repositories/get_daily_missions";
import { createDailyMissions } from "@/entities/missions/index.server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return makeError(translate("api.no_auth", lang), 401);

    const missions = await getUserDailyMissions(userId);
    if (!missions) return makeError(translate("api.info_not_found", lang), 400);

    const response: GetDailyMissionsResponseType = {
      data: {
        missions: missions,
      },
      message: "ок",
      type: "success",
    };

    getDailyMissionsResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (err) {
    console.error("❌ /api/missions error", err);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

export async function POST(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const body = await req.json();
    const parsed = getDailyMissionsRequestSchema.safeParse(body);
    if (!parsed.success) {
      return makeError(translate("api.invalid_request_data", lang), 400);
    }
    const { userId } = parsed.data;

    await createDailyMissions(userId);

    const response: CreateDailyMissionsResponseType = {
      data: {
        userId: userId,
      },
      message: translate("api.successful_registration", lang),
      type: "success",
    };

    createDailyMissionsResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error creating daily missions:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

import { NextResponse } from "next/server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { GetUserQiSkills } from "@/entities/qi_skiils/index.server";
import { getUserQiSkillsResponseSchema } from "@/entities/qi_skiils/_domain/schemas";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { translate } from "@/features/translations/server/translate_fn";
import { GetUserQiSkillsResponseType } from "@/entities/qi_skiils";

export async function GET(req: Request) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return makeError(translate("api.no_auth", lang), 401);

    const skills = await GetUserQiSkills(userId);
    if (!skills) {
      return makeError(translate("api.info_not_found", lang), 404);
    }
    const response: GetUserQiSkillsResponseType = {
      data: skills,
      type: "success",
      message: "CheckAllFacts updated successfully",
    };
    getUserQiSkillsResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (err) {
    console.error("GET /api/user/qi-skills:", err);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

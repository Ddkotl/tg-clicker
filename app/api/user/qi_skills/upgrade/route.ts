import { profileRepository } from "@/entities/profile/index.server";
import {
  updateUserQiSkillRequestSchema,
  updateUserQiSkillsResponseSchema,
  UpdateUserQiSkillsResponseType,
} from "@/entities/qi_skiils";
import { GetUserQiSkills, UpdateQiSkill } from "@/entities/qi_skiils/index.server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { QiSkillsConfig } from "@/shared/game_config/qi_skills/qi_skills";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return makeError(translate("api.no_auth", lang), 401);

    const body = await req.json();
    const parsed = updateUserQiSkillRequestSchema.safeParse(body);
    if (!parsed.success) return makeError(translate("api.invalid_request_data", lang), 400);

    const skill = parsed.data.skill;

    if (!QiSkillsConfig[skill]) return makeError(translate("api.invalid_request_data", lang), 400);

    const user = await profileRepository.getByUserId({ userId });
    const skills = await GetUserQiSkills(userId);

    if (!user || !user.spirit_cristal || !skills) {
      return makeError(translate("api.info_not_found", lang), 404);
    }

    const currentLevel = skills[skill];
    const cfg = QiSkillsConfig[skill];

    if (currentLevel >= cfg.maxLevel) return makeError("Max level reached", 400);

    const cost = cfg.calcUpgradeCost(currentLevel);

    if (user.spirit_cristal < cost) return makeError("Not enough qi", 400);

    const updated_profile = await profileRepository.updateResources({
      userId,
      resources: { spirit_cristal: { remove: cost } },
    });
    const updated_skills = await UpdateQiSkill({ userId, skill });
    if (!updated_profile || !updated_profile.spirit_cristal || !updated_skills) {
      return makeError(translate("api.info_not_found", lang), 404);
    }
    const response: UpdateUserQiSkillsResponseType = {
      data: {
        skills: updated_skills,
        spirit_cristal: updated_profile.spirit_cristal,
      },
      type: "success",
      message: "updated successfully",
    };
    updateUserQiSkillsResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (err) {
    console.error("POST /api/user/qi-skills/upgrade:", err);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

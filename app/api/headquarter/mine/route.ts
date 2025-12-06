import { miningResponseSchema, MiningResponseType } from "@/entities/mining";
import { CalcMineReward } from "@/shared/game_config/mining/calc_mine_reward";
import { rateLimitRedis } from "@/shared/lib/redis_limiter";
import { NextRequest, NextResponse } from "next/server";
import { pushToSubscriber } from "@/shared/connect/redis_connect";
import { getMineExperience } from "@/shared/game_config/exp/give_expirience";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { validateActionToken } from "@/shared/lib/api_helpers/action_token/validate_action_oken";
import { CreateUserMine, GetUserMine, giveMineRevard } from "@/entities/mining/index.server";
import { restoreEnergy } from "@/entities/mining/_vm/restore_mine_energy";
import { MINE_COOLDOWN } from "@/shared/game_config/mining/mining_const";
import { checkUserDeals } from "@/entities/user/_repositories/check_user_deals";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { FactsStatus, FactsType, MissionType } from "@/_generated/prisma";
import { CheckUpdateLvl } from "@/entities/profile/_repositories/check_update_lvl";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { statisticRepository } from "@/entities/statistics/index.server";
import { missionRepository } from "@/entities/missions/index.server";
import { factsRepository } from "@/entities/facts/index.server";
import { profileRepository } from "@/entities/profile/index.server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const lang = getCookieLang({ headers: req.headers });
  const userId = getCookieUserId({ headers: req.headers });
  try {
    if (!userId) return makeError(translate("api.no_auth", lang), 401);

    const { allowed } = await rateLimitRedis(`rl:mine:${userId}`, 10, 60);
    if (!allowed) return makeError(translate("api.rate_limit_exceeded", lang), 429);

    const tokenError = await validateActionToken(req, "action-token");
    if (tokenError) return makeError(translate("api.invalid_token", lang), 401);
    const user_deals = await checkUserDeals({ userId: userId });
    if (!user_deals || user_deals === null) return makeError(translate("api.invalid_process", lang), 400);
    if (user_deals !== "ок") return makeError(user_deals, 400);
    const now = new Date();
    let user_mine = await GetUserMine(userId);
    if (!user_mine) {
      user_mine = await CreateUserMine(userId, now);
    }
    if (!user_mine || user_mine === null) {
      return makeError(translate("api.invalid_process", lang), 400);
    }

    user_mine = await restoreEnergy(userId, user_mine, now);

    if (user_mine.last_mine_at && now.getTime() - user_mine.last_mine_at.getTime() < MINE_COOLDOWN) {
      const remaining = Math.ceil(MINE_COOLDOWN - (now.getTime() - user_mine.last_mine_at.getTime()));
      return makeError(translate("api.cooldown", lang, { remaining }), 429);
    }

    if (user_mine.energy <= 0) return makeError(translate("api.no_energy", lang), 400);

    const reward = CalcMineReward();
    const exp = getMineExperience();

    const result = await giveMineRevard(userId, reward, exp, now);
    if (!result || result === null) return makeError(translate("api.invalid_process", lang), 400);
    const updated_daily_stats = await statisticRepository.updateUserDailyStats({
      userId: userId,
      data: {
        mined_qi_stone: reward,
        exp: exp,
        mined_count: 1,
      },
    });
    if (!updated_daily_stats || updated_daily_stats === null)
      return makeError(translate("api.invalid_process", lang), 400);
    await pushToSubscriber(userId, result.fact.type);
    const completed_missions = [];
    const mine_mission = await missionRepository.UpdateProgressMission({
      userId: userId,
      mission_type: MissionType.MINE,
      progress: 1,
    });
    if (mine_mission?.is_completed && mine_mission?.is_active) {
      await profileRepository.updateResources({
        userId,
        resources: {
          qi: mine_mission.reward_qi,
          qi_stone: mine_mission.reward_qi_stone,
          spirit_cristal: mine_mission.reward_spirit_cristal,
          glory: mine_mission.reward_glory,
          exp: mine_mission.reward_exp,
        },
      });
      const updated_daily_stats = await statisticRepository.updateUserDailyStats({
        userId: userId,
        data: {
          exp: exp,
        },
      });
      if (!updated_daily_stats || updated_daily_stats === null)
        return makeError(translate("api.invalid_process", lang), 400);
      await factsRepository.createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: mine_mission.reward_exp,
        qi_reward: mine_mission.reward_qi,
        reward_spirit_cristal: mine_mission.reward_spirit_cristal,
        qi_stone_reward: mine_mission.reward_qi_stone,
        reward_glory: mine_mission.reward_glory,
        target: mine_mission.target_value,
        mission_type: mine_mission.type,
      });
      await missionRepository.InactivateMission({ userId: mine_mission.userId, mission_type: mine_mission.type });
      completed_missions.push(mine_mission);
    }
    const mine_stone_mission = await missionRepository.UpdateProgressMission({
      userId: userId,
      mission_type: MissionType.MINE_STONE,
      progress: result.fact.qi_stone_reward!,
    });
    if (mine_stone_mission?.is_completed && mine_stone_mission?.is_active) {
      await profileRepository.updateResources({
        userId,
        resources: {
          qi: mine_stone_mission.reward_qi,
          qi_stone: mine_stone_mission.reward_qi_stone,
          spirit_cristal: mine_stone_mission.reward_spirit_cristal,
          glory: mine_stone_mission.reward_glory,
          exp: mine_stone_mission.reward_exp,
        },
      });
      const updated_daily_stats = await statisticRepository.updateUserDailyStats({
        userId: userId,
        data: {
          exp: exp,
        },
      });
      if (!updated_daily_stats || updated_daily_stats === null)
        return makeError(translate("api.invalid_process", lang), 400);
      await factsRepository.createFact({
        userId,
        fact_status: FactsStatus.NO_CHECKED,
        fact_type: FactsType.MISSION,
        exp_reward: mine_stone_mission.reward_exp,
        qi_reward: mine_stone_mission.reward_qi,
        reward_spirit_cristal: mine_stone_mission.reward_spirit_cristal,
        qi_stone_reward: mine_stone_mission.reward_qi_stone,
        reward_glory: mine_stone_mission.reward_glory,
        target: mine_stone_mission.target_value,
        mission_type: mine_stone_mission.type,
      });
      await missionRepository.InactivateMission({
        userId: mine_stone_mission.userId,
        mission_type: mine_stone_mission.type,
      });
      completed_missions.push(mine_stone_mission);
    }
    const lvl = await CheckUpdateLvl(userId);
    const response: MiningResponseType = {
      data: {
        userId,
        lvl: lvl ? lvl : result.profile.lvl,
        energy: result.mine.energy,
        exp_reward: exp,
        qi_stone_reward: reward,
        last_energy_at: result.mine.last_energy_at?.getTime() ?? null,
        last_mine_at: result.mine.last_mine_at?.getTime() ?? null,
        missions: completed_missions,
      },
      type: "ok",
      message: "Mining was successful",
    };

    miningResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarter/mining:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

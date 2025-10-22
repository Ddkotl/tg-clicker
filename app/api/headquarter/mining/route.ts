import { miningRequestSchema, miningResponseSchema, MiningResponseType } from "@/entities/mining";
import { CalcMineReward } from "@/shared/game_config/mining/calc_mine_reward";
import { rateLimitRedis } from "@/shared/lib/redis_limiter";
import { NextRequest, NextResponse } from "next/server";
import { pushToSubscriber } from "../../user/facts/stream/route";
import { getMineExperience } from "@/shared/game_config/exp/give_expirience";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { validateActionToken } from "@/shared/lib/api_helpers/action_token/validate_action_oken";
import { CreateUserMine, GetUserMine, giveMineRevard } from "@/entities/mining/index.server";
import { restoreEnergy } from "@/entities/mining/_vm/restore_mine_energy";
import { MINE_COOLDOWN } from "@/shared/game_config/mining/mining_const";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = miningRequestSchema.safeParse(body);
    if (!parsed.success) return makeError("Invalid request data", 400);
    const userId = parsed.data.userId;

    const { allowed } = await rateLimitRedis(`rl:mine:${userId}`, 10, 60);
    if (!allowed) return makeError("Rate limit exceeded", 429);

    const tokenError = await validateActionToken(req, "action-auth");
    if (tokenError) return tokenError;

    const now = new Date();

    let user_mine = await GetUserMine(userId);
    if (!user_mine) {
      user_mine = await CreateUserMine(userId, now);
    }
    if (!user_mine || user_mine === null) {
      return makeError("invalid user_mine", 400);
    }

    user_mine = await restoreEnergy(userId, user_mine, now);

    if (user_mine.last_mine_at && now.getTime() - user_mine.last_mine_at.getTime() < MINE_COOLDOWN) {
      const remaining = Math.ceil((MINE_COOLDOWN - (now.getTime() - user_mine.last_mine_at.getTime())) / 1000);
      return makeError(`Cooldown: wait ${remaining}s`, 429);
    }

    if (user_mine.energy <= 0) return makeError("No energy", 400);

    const reward = CalcMineReward();
    const exp = getMineExperience(reward);

    const result = await giveMineRevard(userId, reward, exp, now);
    if (!result) return makeError("giveMineRevard err", 400);

    await pushToSubscriber(userId, result.fact.type);

    const response: MiningResponseType = {
      data: {
        userId,
        energy: result.mine.energy,
        exp_reward: exp,
        gold_reward: reward,
        last_energy_at: result.mine.last_energy_at?.getTime() ?? null,
        last_mine_at: result.mine.last_mine_at?.getTime() ?? null,
      },
      type: "ok",
      message: "Mining was successful",
    };

    miningResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarter/mining:", error);
    return makeError("Internal server error", 500);
  }
}

import { ProfileResponse, profileResponseSchema } from "@/entities/profile";
import { profileRepository } from "@/entities/profile/index.server";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { bankExchangeRequestSchema } from "@/features/bank/_domain/schemas";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { dataBase } from "@/shared/connect/db_connect";
import { CRISTAL_COST, STONE_COST } from "@/shared/game_config/bank/bank";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { rateLimitRedis } from "@/shared/lib/redis_limiter";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const req_headers = req.headers;
  const userId = getCookieUserId({ headers: req_headers });
  const lang = getCookieLang({ headers: req_headers });
  try {
    const { allowed } = await rateLimitRedis(`rl:exchange_res:${userId}`, 10, 60);
    if (!allowed) return makeError(translate("api.rate_limit_exceeded", lang), 429);
    if (!userId) return makeError(translate("api.no_auth", lang), 401);

    const body = await req.json();
    const parsed = bankExchangeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return makeError(translate("api.invalid_request_data", lang), 400);
    }
    const { amount, exchangeType } = parsed.data;
    if (amount <= 0 || !exchangeType) {
      return makeError(translate("api.invalid_request_data", lang), 400);
    }
    const result = await dataBase.$transaction(async (tx) => {
      const profile = await profileRepository.getByUserId({ userId, tx });
      if (!profile) throw new Error(translate("api.info_not_found", lang));
      if (exchangeType === "stones_to_cristals") {
        const cost = Math.floor(amount / CRISTAL_COST);
        if (profile.qi_stone < amount) {
          throw new Error("no enought stones");
        }
        return profileRepository.updateResources({
          userId,
          tx,
          resources: {
            qi_stone: { remove: amount },
            spirit_cristal: { add: cost },
          },
        });
      }
      if (exchangeType === "cristals_to_stones") {
        const cost = amount * STONE_COST;
        if (profile.spirit_cristal < cost) {
          throw new Error("no enought cristals");
        }
        return profileRepository.updateResources({
          userId,
          tx,
          resources: {
            spirit_cristal: { remove: cost },
            qi_stone: { add: amount },
          },
        });
      }
      throw new Error("invalid exchange type");
    });
    if (!result) return makeError(translate("api.invalid_process", lang), 400);
    const response: ProfileResponse = {
      data: {
        ...result,
      },
      message: "Profile fetched successfully",
    };

    profileResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(translate("api.internal_server_error", lang), error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/entities/user/_repositories/user_repository";
import { getCookieUserId } from "@/features/auth/get_cookie_userId";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { translate } from "@/features/translations/server/translate_fn";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { ProfileSchema } from "@/entities/profile";

const referralResponseSchema = z.object({
  data: z.object({
    referrals: z.array(ProfileSchema),
    referrer: ProfileSchema.nullable(),
    telegram_id: z.string(),
  }),
  message: z.string(),
});

export type ReferralResponse = z.infer<typeof referralResponseSchema>;

export async function GET(request: NextRequest) {
  const lang = getCookieLang({ headers: request.headers });
  const userId = getCookieUserId({ headers: request.headers });
  try {
    if (!userId) {
      return makeError(translate("api.no_auth", lang), 401);
    }
    const user = await userRepository.getUserById({ userId: userId });
    if (!user) {
      return makeError(translate("api.no_auth", lang), 401);
    }
    const referrals = await userRepository.getReferrals({ userId: userId });
    const referrerUser = await userRepository.getReferer({ userId: userId });
    const referrer = referrerUser?.profile ?? null;

    const response: ReferralResponse = {
      data: {
        referrals: referrals.map((user) => user.profile).filter((profile) => profile !== null),
        referrer,
        telegram_id: user.telegram_id,
      },
      message: "ok",
    };
    referralResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /referrals error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

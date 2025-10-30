import { getActionTokenResponseSchema, GetActionTokenResponseType } from "@/entities/auth";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { createJwtActive } from "@/shared/lib/api_helpers/action_token/jwt";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const new_action_jwt = await createJwtActive();
    if (!new_action_jwt || new_action_jwt === null) {
      return makeError(translate("api.invalid_token", lang), 401);
    }
    const response: GetActionTokenResponseType = {
      message: "ok",
      data: {
        action_token: new_action_jwt,
      },
    };
    getActionTokenResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /auth/action-token error:", error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

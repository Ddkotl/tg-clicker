import { NextRequest, NextResponse } from "next/server";
import { registrationRequestSchema, registrationResponseSchema, RegistrationResponseType } from "@/entities/auth";
import { RegistrationUser } from "@/entities/auth/index.server";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { Fraktion, Gender } from "@/_generated/prisma/enums";

export async function POST(req: NextRequest) {
  const lang = getCookieLang({ headers: req.headers });
  try {
    const body = await req.json();
    const parsed = registrationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return makeError(translate("api.invalid_request_data", lang), 400);
    }

    const { userId, nikname, fraktion, gender, color_theme, avatar_url } = parsed.data;

    const updatedProfile = await RegistrationUser({
      userId,
      nikname,
      fraktion,
      gender,
      color_theme,
      avatar_url,
    });
    if (!updatedProfile) {
      return makeError(translate("api.invalid_registration_user", lang), 400);
    }
    const response: RegistrationResponseType = {
      data: {
        userId: updatedProfile.userId,
        nikname: updatedProfile.nikname ?? "",
        fraktion: updatedProfile.fraktion ?? Fraktion.ADEPT,
        gender: updatedProfile.gender ?? Gender.MALE,
        color_theme: updatedProfile.color_theme ?? "",
        avatar_url: updatedProfile.avatar_url ?? "",
      },
      message: translate("api.successful_registration", lang),
      type: "success",
    };

    registrationResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(translate("api.internal_server_error", lang), error);
    return makeError(translate("api.internal_server_error", lang), 500);
  }
}

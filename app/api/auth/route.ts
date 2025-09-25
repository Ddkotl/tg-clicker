import { NextRequest, NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/utils/telegramAuth";
import { AppJWTPayload, encrypt, SESSION_DURATION } from "@/utils/session";
import { UpdateOrCreateUser } from "@/repositories/user_repository";

export async function POST(request: NextRequest) {
  const { initData, ref } = await request.json();
  const validationResult = validateTelegramWebAppData(initData);
  if (validationResult.validatedData && validationResult.user.id) {
    const updated_user = await UpdateOrCreateUser(
      {
        ...validationResult.user,
        telegram_id: validationResult.user.id,
      },
      ref,
    );
    if (!updated_user) {
      return NextResponse.json({ message: "user not created" }, { status: 401 });
    }
    const user = { telegram_id: validationResult.user.id };

    const expiresData = new Date(Date.now() + SESSION_DURATION);
    const expiresString = new Date(Date.now() + SESSION_DURATION).toISOString();

    const payload: AppJWTPayload = {
      user,
      expires: expiresString,
    };
    const session = await encrypt(payload);

    const response = NextResponse.json({
      message: "Authentication successful",
      language_code: updated_user.language_code,
      nikname: updated_user.profile?.nikname,
    });
    response.cookies.set({
      name: "session",
      value: session,
      expires: expiresData,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return response;
  } else {
    return NextResponse.json({ message: validationResult.message }, { status: 401 });
  }
}

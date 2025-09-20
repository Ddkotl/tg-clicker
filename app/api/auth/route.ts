import { NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/utils/telegramAuth";
import { encrypt, SESSION_DURATION } from "@/utils/session";
import { CreateUser } from "@/repositories/user_repository";

export async function POST(request: Request) {
  const { initData } = await request.json();

  const validationResult = validateTelegramWebAppData(initData);
  if (validationResult.validatedData && validationResult.user.id) {
    const is_user_created = await CreateUser({
      ...validationResult.user,
      telegram_id: +validationResult.user.id,
    });
    if (!is_user_created) {
      return NextResponse.json(
        { message: "user not created" },
        { status: 401 },
      );
    }
    const user = { telegram_id: validationResult.user.id };

    const expires = new Date(Date.now() + SESSION_DURATION);
    const session = await encrypt({ user, expires });

    const response = NextResponse.json({
      message: "Authentication successful",
    });
    response.cookies.set({
      name: "session",
      value: session,
      expires,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return response;
  } else {
    return NextResponse.json(
      { message: validationResult.message },
      { status: 401 },
    );
  }
}

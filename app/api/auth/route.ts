import { NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/utils/telegramAuth";
import { encrypt, SESSION_DURATION } from "@/utils/session";

export async function POST(request: Request) {
  const { initData } = await request.json();

  const validationResult = validateTelegramWebAppData(initData);

  if (validationResult.validatedData) {
    console.log("Validation result: ", validationResult);
    const user = { telegramId: validationResult.user.id };

    // Create a new session
    const expires = new Date(Date.now() + SESSION_DURATION);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
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

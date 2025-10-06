import { NextRequest, NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/utils/telegramAuth";
import { AppJWTPayload, encrypt, SESSION_DURATION } from "@/utils/session";
import { UpdateOrCreateUser } from "@/repositories/user_repository";
import { z } from "zod";

const authSchema = z.object({
  initData: z.string(),
  ref: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsedBody = authSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Invalid request data", errors: parsedBody.error },
      { status: 400 },
    );
  }

  const { initData, ref } = parsedBody.data;
  const validationResult = validateTelegramWebAppData(initData);

  if (!validationResult.validatedData || !validationResult.user.id) {
    return NextResponse.json(
      { message: validationResult.message },
      { status: 401 },
    );
  }

  const updated_user = await UpdateOrCreateUser(
    {
      ...validationResult.user,
      telegram_id: validationResult.user.id,
    },
    ref,
  );

  if (!updated_user) {
    return NextResponse.json({ message: "User not created" }, { status: 401 });
  }

  const payload: AppJWTPayload = {
    user: {
      telegram_id: updated_user.telegram_id,
      userId: updated_user.id,
    },
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION / 1000, // JWT exp
  };

  const session = await encrypt(payload);

  const response = NextResponse.json({
    message: "Authentication successful",
    language_code: updated_user.language_code,
    nikname: updated_user.profile?.nikname,
    color_theme: updated_user.profile?.color_theme,
  });

  response.cookies.set({
    name: "session",
    value: session,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return response;
}

import { SupportedLang } from "@/features/translations/translate_type";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

// Срок действия cookie (1 час)
export const SESSION_DURATION = 60 * 60 * 1000;

export interface AppJWTPayload extends JWTPayload {
  user: {
    userId: string;
    telegram_id: string;
    lang: SupportedLang;
  };
}

/**
 * Создание нового JWT
 */
export async function encrypt(payload: AppJWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

/**
 * Расшифровка JWT с проверкой подписи и exp
 */
export async function decrypt(input: string): Promise<AppJWTPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as AppJWTPayload;
}

/**
 * Получение текущей сессии из cookie
 * — автоматически удаляет cookie, если сессия истекла или недействительна
 */
export async function getSession(): Promise<AppJWTPayload | null> {
  const cookies_store = await cookies();
  const session = cookies_store.get("session")?.value;
  if (!session) return null;

  try {
    const payload = await decrypt(session);

    // Проверка истечения exp
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Обновление срока жизни сессии (refresh)
 */
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  let parsed: AppJWTPayload;
  try {
    parsed = await decrypt(session);
  } catch {
    return;
  }

  // Проверяем exp
  if (parsed.exp && Date.now() >= parsed.exp * 1000) {
    return;
  }

  const payload: AppJWTPayload = {
    user: {
      telegram_id: parsed.user.telegram_id,
      userId: parsed.user.userId,
      lang: parsed.user.lang,
    },
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION / 1000,
  };
  // Пересоздаём токен с новым exp
  const newToken = await encrypt(payload);
  const expiresDate = new Date(Date.now() + SESSION_DURATION);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: newToken,
    expires: expiresDate,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  const decrypted_token = await decrypt(newToken);

  return decrypted_token;
}

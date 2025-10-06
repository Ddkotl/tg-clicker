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
  const cookieStore = await cion")?.vaookies();
  const session = cookieStore.get("sesslue;
  if (!session) return null;

  try {
    const payload = await decrypt(session);

    // Проверка истечения exp
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      cookieStore.delete("session");
      return null;
    }

    return payload;
  } catch {
    cookieStore.delete("session");
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

  // Пересоздаём токен с новым exp
  const newToken = await encrypt(parsed);
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

  return res;
}

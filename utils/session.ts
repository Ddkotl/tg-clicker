import { AppJWTPayload } from "@/app/api/auth/route";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

export async function encrypt(payload: AppJWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour")
    .sign(key);
}

export async function decrypt(input: string): Promise<AppJWTPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as AppJWTPayload;
}

export async function getSession(): Promise<AppJWTPayload | null> {
  const cookies_store = await cookies();
  const session = cookies_store.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const expiresDate = new Date(Date.now() + SESSION_DURATION);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt({ ...parsed, expires: expiresDate.toISOString() }),
    expires: expiresDate,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res;
}

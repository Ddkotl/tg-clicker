import { JWTPayload, jwtVerify, SignJWT } from "jose";

export type JwtActivePaloadType = {
  data: string;
  type: string;
} & JWTPayload;

export async function verifyJwtActive(token: string): Promise<JwtActivePaloadType | null> {
  try {
    const secret = process.env.ACTIV_SECRET;
    if (!secret) {
      console.error("verifyJwtActive error, no secret");
      return null;
    }
    const encoded_secret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify<{ data: string; type: string }>(token, encoded_secret);
    if (payload.type !== "action") return null;

    return payload;
  } catch (error) {
    console.error("verifyJwtActive error", error);
    return null;
  }
}
export async function createJwtActive() {
  try {
    const secret = process.env.ACTIV_SECRET;
    if (!secret) {
      console.error("createJwtActive error, no secret");
      return null;
    }
    const encoded_secret = new TextEncoder().encode(secret);
    const new_jwt = await new SignJWT({ data: new Date(), type: "action" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(encoded_secret);
    return new_jwt;
  } catch (error) {
    console.error("createJwtActive error", error);
    return null;
  }
}

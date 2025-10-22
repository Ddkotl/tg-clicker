import { NextRequest, NextResponse } from "next/server";
import { makeError } from "../make_error";
import { verifyJwtActive } from "./jwt";

export async function validateActionToken(req: NextRequest, token_name: string): Promise<NextResponse | null> {
  const header = req.headers.get(token_name);
  if (!header?.startsWith("Bearer ")) return makeError("Missing action token", 401);

  const token = header.split(" ")[1];
  if (!token) return makeError("Missing action token", 401);

  const payload = await verifyJwtActive(token);
  if (!payload) return makeError("verifyJwtActive invalid", 403);

  return null;
}

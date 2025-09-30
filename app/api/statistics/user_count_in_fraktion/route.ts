import { getUserCountsInFractions } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import z from "zod";

const fractionsResponseSchema = z.object({
  adepts: z.number(),
  novices: z.number(),
  isAuthenticated: z.boolean(),
});

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (!session) {
    const response = { adepts: 0, novices: 0, isAuthenticated: false };
    fractionsResponseSchema.parse(response);
    return NextResponse.json(response, { status: 401 });
  }

  const data = await getUserCountsInFractions();
  const response = {
    adepts: data?.adepts ?? 0,
    novices: data?.novices ?? 0,
    isAuthenticated: true,
  };

  fractionsResponseSchema.parse(response);
  return NextResponse.json(response);
}

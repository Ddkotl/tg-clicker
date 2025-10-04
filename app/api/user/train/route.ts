import { updateUserParam } from "@/repositories/update_user_param";
import { getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import z from "zod";

const trainSchema = z.object({
  paramName: z.string(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (session) {
    const body = await req.json();
    const parsed = trainSchema.parse(body);
    const paramName = parsed.paramName;
    const userId = session.user.userId;
    if (!["power", "protection", "speed", "skill", "qi"].includes(paramName)) {
      return NextResponse.json(
        { message: "Invalid param name" },
        { status: 400 },
      );
    }
    const updated_profile = await updateUserParam(userId, paramName);
    return NextResponse.json(updated_profile);
  } else {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}

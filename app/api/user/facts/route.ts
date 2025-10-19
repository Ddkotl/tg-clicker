import { factErrorResponseSchema, FactErrorResponseType, factResponseSchema, FactResponseType } from "@/entities/facts";
import { getUserFacts } from "@/entities/facts/index.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");
    if (!requestedUserId) {
      const response: FactErrorResponseType = {
        data: {},
        message: "User not authenticated",
      };
      factErrorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }
    const user_facts = await getUserFacts(requestedUserId);
    if (!user_facts || user_facts === null) {
      const response: FactErrorResponseType = {
        data: {},
        message: "not user facts",
      };
      factErrorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 404 });
    }
    const response: FactResponseType = {
      data: user_facts,
      message: "Profile fetched successfully",
    };

    factResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /facts", error);
    const response: FactErrorResponseType = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

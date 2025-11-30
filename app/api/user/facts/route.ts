import { factResponseSchema, FactResponseType } from "@/entities/facts";
import { factsRepository } from "@/entities/facts/index.server";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const page = Number(searchParams.get("page") ?? "1");
    const page_size = Number(searchParams.get("page_size") ?? "10");
    if (!userId) {
      return makeError("Missing userId", 400);
    }
    if (!page) {
      return makeError("Missing page", 400);
    }
    if (!page_size) {
      return makeError("Missing page", 400);
    }

    const result = await factsRepository.getUserFacts({ userId: userId, page: page, page_size: page_size });
    if (!result || result === null) {
      return makeError("Failed to fetch user facts", 500);
    }

    const { facts, hasNextPage } = result;

    const response: FactResponseType = {
      data: facts,
      message: "Facts fetched successfully",
      nextPage: hasNextPage ? page + 1 : null,
    };

    factResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /facts error:", error);
    return makeError("Internal server error", 500);
  }
}

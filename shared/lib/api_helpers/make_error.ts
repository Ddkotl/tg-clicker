import { NextResponse } from "next/server";
import { errorResponseSchema } from "./schemas";
import { ErrorResponseType } from "./types";

export function makeError(message: string, status = 400): NextResponse {
  const errorResponse: ErrorResponseType = {
    data: {},
    message: message,
    type: "err",
  };
  errorResponseSchema.parse(errorResponse);
  return NextResponse.json(errorResponse, { status });
}

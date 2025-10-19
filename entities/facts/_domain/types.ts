import z from "zod";
import {
  checkAllFactsErrorResponseSchema,
  checkAllFactsRequestSchema,
  checkAllFactsResponseSchema,
  factErrorResponseSchema,
  factResponseSchema,
} from "./schemas";

export type FactResponseType = z.infer<typeof factResponseSchema>;
export type FactErrorResponseType = z.infer<typeof factErrorResponseSchema>;

export type CheckAllFactsRequestType = z.infer<typeof checkAllFactsRequestSchema>;
export type CheckAllFactsResponseType = z.infer<typeof checkAllFactsResponseSchema>;
export type CheckAllFactsErrorResponseType = z.infer<typeof checkAllFactsErrorResponseSchema>;

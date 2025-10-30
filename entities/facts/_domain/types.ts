import z from "zod";
import {
  checkAllFactsErrorResponseSchema,
  checkAllFactsRequestSchema,
  checkAllFactsResponseSchema,
  factCoutNocheckResponseSchema,
  factErrorResponseSchema,
  factRequestSchema,
  factResponseSchema,
} from "./schemas";

export type factRequestTipe = z.infer<typeof factRequestSchema>;
export type FactResponseType = z.infer<typeof factResponseSchema>;
export type FactErrorResponseType = z.infer<typeof factErrorResponseSchema>;
export type FactCoutNocheckResponseType = z.infer<typeof factCoutNocheckResponseSchema>;

export type CheckAllFactsRequestType = z.infer<typeof checkAllFactsRequestSchema>;
export type CheckAllFactsResponseType = z.infer<typeof checkAllFactsResponseSchema>;
export type CheckAllFactsErrorResponseType = z.infer<typeof checkAllFactsErrorResponseSchema>;

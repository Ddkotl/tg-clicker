import z from "zod";
import { factErrorResponseSchema, factResponseSchema } from "./schemas";

export type FactResponseType = z.infer<typeof factResponseSchema>;
export type FactErrorResponseType = z.infer<typeof factErrorResponseSchema>;

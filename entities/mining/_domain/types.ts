import z from "zod";
import { miningRequestSchema, miningResponseSchema, getMineResponseSchema } from "./schemas";

export type MiningRequestType = z.infer<typeof miningRequestSchema>;
export type MiningResponseType = z.infer<typeof miningResponseSchema>;
export type GetMineResponseType = z.infer<typeof getMineResponseSchema>;

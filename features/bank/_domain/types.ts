import z from "zod";
import { bankExchangeRequestSchema } from "./schemas";

export type BankExchangeRequestType = z.infer<typeof bankExchangeRequestSchema>;

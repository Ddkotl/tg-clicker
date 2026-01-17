import z from "zod";

export const bankExchangeRequestSchema = z.object({
  exchangeType: z.enum(["stones_to_cristals", "cristals_to_stones"]),
  amount: z.number().min(1),
});

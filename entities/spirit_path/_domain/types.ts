import z from "zod";
import {
  getSpiritPathRewardRequestSchema,
  getSpiritPathRewardResponseSchema,
  goSpiritPathRequestSchema,
  goSpiritPathResponseSchema,
  spiritPathFormSchema,
  spiritPathInfoResponseSchema,
} from "./schemas";

export type SpiritPathInfoResponseType = z.infer<typeof spiritPathInfoResponseSchema>;
export type GoSpiritPathRequestType = z.infer<typeof goSpiritPathRequestSchema>;
export type GoSpiritPathResponseType = z.infer<typeof goSpiritPathResponseSchema>;
export type SpiritPathFormType = z.infer<typeof spiritPathFormSchema>;
export type GetSpiritPathRewardRequestType = z.infer<typeof getSpiritPathRewardRequestSchema>;
export type GetSpiritPathRewardResponseType = z.infer<typeof getSpiritPathRewardResponseSchema>;

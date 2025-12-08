import z from "zod";
import {
  createDailyMissionsResponseSchema,
  MissionSchema,
  getDailyMissionsRequestSchema,
  getDailyMissionsResponseSchema,
} from "./schemas";

export type MissionType = z.infer<typeof MissionSchema>;
export type GetDailyMissionsRequestType = z.infer<typeof getDailyMissionsRequestSchema>;
export type GetDailyMissionsResponseType = z.infer<typeof getDailyMissionsResponseSchema>;
export type CreateDailyMissionsResponseType = z.infer<typeof createDailyMissionsResponseSchema>;

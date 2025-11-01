import z from "zod";
import {
  createDailyMissionsResponseSchema,
  DailyMissionSchema,
  getDailyMissionsRequestSchema,
  getDailyMissionsResponseSchema,
} from "./schemas";

export type DailyMissionType = z.infer<typeof DailyMissionSchema>;
export type GetDailyMissionsRequestType = z.infer<typeof getDailyMissionsRequestSchema>;
export type GetDailyMissionsResponseType = z.infer<typeof getDailyMissionsResponseSchema>;
export type CreateDailyMissionsResponseType = z.infer<typeof createDailyMissionsResponseSchema>;

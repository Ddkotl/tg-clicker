import z from "zod";
import {
  createDailyMissionsResponseSchema,
  MissionSchema,
  getDailyMissionsRequestSchema,
  getDailyMissionsResponseSchema,
  checkSubscribeResponseSchema,
  checkSubscribeSchema,
} from "./schemas";

export type MissionType = z.infer<typeof MissionSchema>;
export type GetDailyMissionsRequestType = z.infer<typeof getDailyMissionsRequestSchema>;
export type GetDailyMissionsResponseType = z.infer<typeof getDailyMissionsResponseSchema>;
export type CreateDailyMissionsResponseType = z.infer<typeof createDailyMissionsResponseSchema>;
export type CheckSubscribeResponseType = z.infer<typeof checkSubscribeResponseSchema>;
export type CheckSubscribeRequestType = z.infer<typeof checkSubscribeSchema>;

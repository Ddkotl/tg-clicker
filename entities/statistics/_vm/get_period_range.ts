import {
  getEndOfMonth,
  getEndOfToday,
  getEndOfWeek,
  getStartOfMonth,
  getStartOfToday,
  getStartOfWeek,
} from "@/shared/lib/date";
import { RatingsTypes } from "../_domain/types";

export function getPeriodRange(type: RatingsTypes) {
  switch (type) {
    case "daily":
      return {
        start: getStartOfToday(),
        end: getEndOfToday(),
      };

    case "weekly":
      return {
        start: getStartOfWeek(),
        end: getEndOfWeek(),
      };

    case "monthly":
      return {
        start: getStartOfMonth(),
        end: getEndOfMonth(),
      };

    case "overall":
    default:
      return null;
  }
}

import {
  getEndOfMonth,
  getEndOfToday,
  getEndOfWeek,
  getNowTime,
  getStartOfMonth,
  getStartOfToday,
  getStartOfWeek,
} from "@/shared/lib/date";
import { RatingsTypes } from "../_domain/ratings_list_items";

export function getPeriodRange(type: RatingsTypes) {
  const now = getNowTime();

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

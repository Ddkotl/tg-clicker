import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

export function getNowTime() {
  return dayjs().tz("UTC");
}

export function getStartOfToday() {
  return dayjs().tz("UTC").startOf("day").toDate();
}

export function getEndOfToday() {
  return dayjs().tz("UTC").endOf("day").toDate();
}

export function getStartOfWeek() {
  return dayjs().tz("UTC").startOf("isoWeek").toDate();
}

export function getEndOfWeek() {
  return dayjs().tz("UTC").endOf("isoWeek").toDate();
}

export function getStartOfMonth() {
  return dayjs().tz("UTC").startOf("month").toDate();
}

export function getEndOfMonth() {
  return dayjs().tz("UTC").endOf("month").toDate();
}
export function getDaysAgoDate(days: number) {
  return dayjs().tz("UTC").subtract(days, "day").toDate();
}

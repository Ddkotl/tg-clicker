import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { SupportedLang } from "@/features/translations/translate_type";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(localizedFormat);

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

export function isSameDay(date1: Date, date2: Date) {
  return dayjs(date1).isSame(dayjs(date2), "day");
}
export function getLocalFormatedDate({ date, lang }: { date: Date; lang: SupportedLang }) {
  const formattedDate = dayjs(date)
    .locale(lang === "ru" ? "ru" : "en")
    .format("D MMMM YYYY, HH:mm");
  return formattedDate;
}

"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { TimeAgo } from "@/shared/components/custom_ui/time_ago";

const FIVE_MINUTES = 5 * 60 * 1000;

export function DisplayPlayerOnline({
  date,
  t,
}: {
  date: string | number | Date;
  t?: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const lastActive = new Date(date).getTime();
  const now = Date.now();
  const diff = now - lastActive;

  const isOnline = diff < FIVE_MINUTES;

  const offlineSince = lastActive;
  const color = isOnline ? "bg-green-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2 text-foreground text-sm font-semibold">
      <span className="relative flex size-3">
        {isOnline && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex size-3 rounded-full ${color}`}></span>
      </span>

      {isOnline && t && <span>{t("profile.online")}</span>}
      {!isOnline && t && (
        <span className="flex items-center gap-1">
          {t("profile.offline")}:
          <TimeAgo date={offlineSince} />
        </span>
      )}
    </div>
  );
}

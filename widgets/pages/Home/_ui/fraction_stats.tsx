"use client";

import { UserCountInFrResponseType } from "@/entities/statistics";
import { TranslationKey } from "@/features/translations/translate_type";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function FractionStats({
  t,
  isLoadingFractionCounts,
  dataFractionCounts,
}: {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  isLoadingFractionCounts: boolean;
  dataFractionCounts?: UserCountInFrResponseType;
}) {
  return (
    <>
      <span className="text-primary font-semibold">
        {t("fraction.adepts")} –{" "}
        {isLoadingFractionCounts ? (
          <Skeleton className="mx-2 h-3 w-8 inline-block align-middle" />
        ) : (
          ` ${dataFractionCounts?.data?.adepts},`
        )}
      </span>
      <span className="text-primary font-semibold">
        {t("fraction.novices")} –{" "}
        {isLoadingFractionCounts ? (
          <Skeleton className="mx-2 h-3 w-8 inline-block align-middle" />
        ) : (
          ` ${dataFractionCounts?.data?.novices}.`
        )}
      </span>
    </>
  );
}

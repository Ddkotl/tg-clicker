"use client";
import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { FactResponseType, getFactsQuery } from "@/entities/facts";
import { Spinner } from "@/shared/components/ui/spinner";
import { FactsType } from "@/_generated/prisma";
import { getHoursString } from "@/entities/meditation/_vm/getHoursString";
import { TranslationKey } from "@/features/translations/translate_type";

export function FactsList({ t }: { t: (key: TranslationKey, vars?: Record<string, string | number>) => string }) {
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();
  const { data: facts, isLoading: isLoadingFacts } = useQuery<FactResponseType>({
    ...getFactsQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });
  const isLoading = isLoadingSession || isLoadingFacts;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6  text-muted-foreground" />
      </div>
    );
  }
  if (facts?.data.length === 0) {
    return <div>{t("facts.no_fact")}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {facts?.data.map((fact) => {
        if (fact.type === FactsType.MEDITATION) {
          return (
            <div key={fact.id} className="p-3 bg-card/80 text-foreground/80 rounded-md">
              {t("facts.meditation_fact", {
                time: `${fact.active_hours} ${t(`hour.${getHoursString(fact.active_hours ?? 0)}` as TranslationKey)}`,
                mana: fact.mana_reward ?? 0,
                exp: fact.exp_reward ?? 0,
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

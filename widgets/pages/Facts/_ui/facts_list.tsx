"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { FactResponseType, getFactsQuery } from "@/entities/facts";
import { Spinner } from "@/shared/components/ui/spinner";
import { TranslationKey } from "@/features/translations/translate_type";
import { FactItem } from "./fact_item";

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
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (!facts?.data.length) {
    return <div>{t("facts.no_fact")}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {facts.data.map((fact) => (
        <FactItem key={fact.id} fact={fact} t={t} />
      ))}
    </div>
  );
}

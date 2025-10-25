"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { Spinner } from "@/shared/components/ui/spinner";
import { TranslationKey } from "@/features/translations/translate_type";
import { FactItem } from "./fact_item";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getFactsInfiniteQuery } from "../_queries/facts_query";

export function FactsList({ t }: { t: (key: TranslationKey, vars?: Record<string, string | number>) => string }) {
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    ...getFactsInfiniteQuery(userId ?? "", 10),
    enabled: !!userId,
    initialPageParam: 1,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading || isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  const facts = data?.pages.flatMap((page) => page.data) ?? [];

  if (!facts.length) {
    return <div>{t("facts.no_fact")}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {facts.map((fact) => (
        <FactItem key={fact.id} fact={fact} t={t} />
      ))}

      {/* Лоадер снизу */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner className="w-5 h-5 text-muted-foreground" />}
      </div>
    </div>
  );
}

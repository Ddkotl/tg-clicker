"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useGetRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import Link from "next/link";
import { RankingPaginatedCard } from "./RankingPaginatedCard";
import { useTranslation } from "@/features/translations/use_translation";
import { icons } from "@/shared/lib/icons";
import { cn } from "@/shared/lib/utils";
import { ratingMetrics, RatingsMetrics, RatingsTypes } from "../_domain/ratings_list_items";
import { getLevelByExp } from "@/shared/game_config/exp/get_lvl_by_exp";

export function RankingPaginatedList({
  type,
  metric,
  page,
}: {
  type: RatingsTypes;
  metric: RatingsMetrics;
  page: number;
}) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRatingsQuery(type, metric, page);

  if (isLoading || !data) return <ComponentSpinner />;

  return (
    <div className="flex flex-col gap-4">
      {data.data.data.map((player, i) => {
        const valueLabel =
          metric === ratingMetrics.exp ? t("experience") : t(`ranking.ratings.names_types.${metric}_value`);
        const value = player.amount;
        // if (metric === ratingMetrics.exp) {
        //   value = getLevelByExp(player.amount);
        // }
        return (
          <RankingPaginatedCard
            key={player.user?.id}
            rank={(page - 1) * 10 + i + 1}
            img={player.user?.profile?.avatar_url ?? null}
            nickname={player.user?.profile?.nikname ?? null}
            valueLabel={valueLabel}
            value={value}
          />
        );
      })}

      <div className="flex gap-3 mt-4 items-center justify-between">
        {page >= 1 && (
          <Link href={`?page=${page - 1}`} className={cn(page <= 1 && "pointer-events-none opacity-50")}>
            {icons.arrow_right({ className: "rotate-180 inline-block text-white/80 h-8 w-8" })}
          </Link>
        )}
        {page && (
          <Link href={`?page=${page}`} className="px-4 py-2 bg-white/50 rounded">
            {page}
          </Link>
        )}

        {page <= data.data.pages && (
          <Link href={`?page=${page + 1}`} className={cn(page >= data.data.pages && "pointer-events-none opacity-50")}>
            {icons.arrow_right({ className: " inline-block text-white/80 h-8 w-8" })}
          </Link>
        )}
      </div>
    </div>
  );
}

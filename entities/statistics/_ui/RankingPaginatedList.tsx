"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { OverallRatingsMAP_Type } from "../_domain/ratings_list_items";
import { useGetOverallRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import Link from "next/link";
import { RankingPaginatedCard } from "./RankingPaginatedCard";
import { useTranslation } from "@/features/translations/use_translation";
import { icons } from "@/shared/lib/icons";
import { cn } from "@/shared/lib/utils";

export function RankingPaginatedList({ type, page }: { type: OverallRatingsMAP_Type; page: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetOverallRatingsQuery(type, page);

  if (isLoading || !data) return <ComponentSpinner />;

  return (
    <div className="flex flex-col gap-4">
      {data.data.data.map((player, i) => {
        const valueLabel = t(`ranking.ratings.names_types.${type}_value`);
        let value = 0;
        if ("lvl" in player) {
          value = player.lvl;
        } else if ("meditated_hours" in player) {
          value = player.meditated_hours;
        } else if ("spirit_path_minutes" in player) {
          value = player.spirit_path_minutes;
        } else if ("mined_qi_stone" in player) {
          value = player.mined_qi_stone;
        } else if ("fights_wins" in player) {
          value = player.fights_wins;
        }

        return (
          <RankingPaginatedCard
            key={player.user.id}
            rank={(page - 1) * 10 + i + 1}
            img={player.user.profile?.avatar_url ?? null}
            nickname={player.user.profile?.nikname ?? null}
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

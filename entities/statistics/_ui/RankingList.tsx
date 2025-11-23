"use client";
import Link from "next/link";
import { useGetRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import { ui_path } from "@/shared/lib/paths";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { icons } from "@/shared/lib/icons";
import { RankingCard } from "./RankingCard";
import { useTranslation } from "@/features/translations/use_translation";
import { ratingMetrics, RatingsMetrics, RatingsTypes } from "../_domain/ratings_list_items";
import { getLevelByExp } from "@/shared/game_config/exp/get_lvl_by_exp";

export function RankingList({ metric, type, page = 1 }: { metric: RatingsMetrics; type: RatingsTypes; page?: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRatingsQuery(type, metric, page);
  if (isLoading || !data) return <ComponentSpinner />;

  const items = data.data.data.slice(0, 3);

  return (
    <div className="flex flex-col gap-2 w-full pb-4">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold capitalize"> {t(`ranking.ratings.names_types.${metric}`)}</h2>
        <Link
          href={ui_path.rankings_type_page(type, metric, 1)}
          className="underline text-sm opacity-80 hover:opacity-100"
        >
          {icons.arrow_right({})}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {items.map((player, i) => {
          const valueLabel = t(`ranking.ratings.names_types.${metric}_value`);
          let value = player.amount;
          if (metric === ratingMetrics.exp) {
            value = getLevelByExp(player.amount);
          }
          return (
            <RankingCard
              key={player?.user?.id}
              rank={i + 1}
              img={player?.user?.profile?.avatar_url ?? null}
              nickname={player?.user?.profile?.nikname ?? null}
              valueLabel={valueLabel}
              value={value}
            />
          );
        })}
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { OverallRatingsMAP_Type } from "../_domain/ratings_list_items";
import { useGetOverallRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import { ui_path } from "@/shared/lib/paths";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { icons } from "@/shared/lib/icons";
import { RankingCard } from "./RankingCard";
import { useTranslation } from "@/features/translations/use_translation";

export function RankingList({ type, page = 1 }: { type: OverallRatingsMAP_Type; page?: number }) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetOverallRatingsQuery(type, page);
  if (isLoading || !data) return <ComponentSpinner />;

  const items = data.data.data.slice(0, 3);

  return (
    <div className="flex flex-col gap-2 w-full pb-4">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold capitalize"> {t(`ranking.ratings.names_types.${type}`)}</h2>
        <Link
          href={ui_path.rankings_type_page(data.data.rating_type, 1)}
          className="underline text-sm opacity-80 hover:opacity-100"
        >
          {icons.arrow_right({})}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {items.map((player, i) => {
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
            <RankingCard
              key={player.user.id}
              rank={i + 1}
              img={player.user.profile?.avatar_url ?? null}
              nickname={player.user.profile?.nikname ?? null}
              valueLabel={valueLabel}
              value={value}
            />
          );
        })}
      </div>
    </div>
  );
}

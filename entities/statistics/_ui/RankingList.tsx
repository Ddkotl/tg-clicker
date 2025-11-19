"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { OverallRatingsMAP_Type } from "../_domain/ratings_list_items";
import { useGetOverallRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import Link from "next/link";
import { ui_path } from "@/shared/lib/paths";
import { icons } from "@/shared/lib/icons";

export function RankingList({ type, page = 1 }: { type: OverallRatingsMAP_Type; page?: number }) {
  const { data, isLoading } = useGetOverallRatingsQuery(type, page);
  if (isLoading || !data) return <ComponentSpinner />;

  const items = data.data.data;

  return (
    <div className="flex  gap-2">
      {items.slice(0, 3).map((player, i) => (
        <div
          key={player.user.id}
          className="flex flex-col items-center justify-center w-full justify-between p-2 rounded bg-white/5"
        >
          <div className="flex gap-3">
            <span>{(page - 1) * data.data.pageSize + i + 1}.</span>
            <span>{player.user.profile?.nikname ?? "Unknown"}</span>
          </div>

          <div>
            {"lvl" in player && <>lvl: {player.lvl}</>}
            {"meditated_hours" in player && <>med: {player.meditated_hours}</>}
            {"spirit_path_minutes" in player && <>spirit: {player.spirit_path_minutes}</>}
            {"mined_qi_stone" in player && <>mine: {player.mined_qi_stone}</>}
            {"fights_wins" in player && <>wins: {player.fights_wins}</>}
          </div>
        </div>
      ))}
      <Link href={ui_path.rankings_type_page(data.data.rating_type, 1)} className="underline">
        {icons.arrow_right({})}
      </Link>
    </div>
  );
}

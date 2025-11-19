"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { OverallRatingsMAP_Type } from "../_domain/ratings_list_items";
import { useGetOverallRatingsQuery } from "../_queries/use_get_overall_ratings_query";

export function RankingList({ type }: { type: OverallRatingsMAP_Type }) {
  const { data, isLoading } = useGetOverallRatingsQuery(type);

  if (isLoading || !data) return <ComponentSpinner />;
  return (
    <div className="flex flex-col gap-2">
      {data.data.rating_typedata.map((player, i) => (
        <div key={player.user.id} className="flex justify-between p-2 rounded bg-white/5">
          <div className="flex gap-3">
            <span>{i + 1}.</span>
            <span>{player.user.profile?.nikname ?? "Unknown"}</span>
          </div>

          <div>
            {/* Автоматическое поле в зависимости от рейтинга */}
            {player.lvl && <>lvl: {player.lvl}</>}
            {player.meditated_hours && <>med: {player.meditated_hours}</>}
            {player.spirit_path_minutes && <>spirit: {player.spirit_path_minutes}</>}
            {player.mined_qi_stone && <>mine: {player.mined_qi_stone}</>}
            {player.fights_wins && <>wins: {player.fights_wins}</>}
          </div>
        </div>
      ))}
    </div>
  );
}

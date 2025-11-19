"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { OverallRatingsMAP_Type } from "../_domain/ratings_list_items";
import { useGetOverallRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import Link from "next/link";

export function RankingPaginatedList({ type, page }: { type: OverallRatingsMAP_Type; page: number }) {
  const { data, isLoading } = useGetOverallRatingsQuery(type, page);

  if (isLoading || !data) return <ComponentSpinner />;

  return (
    <div className="flex flex-col gap-4">
      {data.data.data.map((player, i) => (
        <div key={player.user.id} className="p-3 bg-white/5 rounded">
          <div>
            {(page - 1) * data.data.pageSize + i + 1}. {player.user.profile?.nikname}
          </div>

          <div className="opacity-70">
            {"lvl" in player && <>lvl: {player.lvl}</>}
            {"meditated_hours" in player && <>med: {player.meditated_hours}</>}
            {"spirit_path_minutes" in player && <>spirit: {player.spirit_path_minutes}</>}
            {"mined_qi_stone" in player && <>mine: {player.mined_qi_stone}</>}
            {"fights_wins" in player && <>wins: {player.fights_wins}</>}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        {page > 1 && (
          <Link href={`?page=${page - 1}`} className="px-4 py-2 bg-white/10 rounded">
            Назад
          </Link>
        )}

        {page < data.data.pages && (
          <Link href={`?page=${page + 1}`} className="px-4 py-2 bg-white/10 rounded">
            Вперёд
          </Link>
        )}
      </div>
    </div>
  );
}

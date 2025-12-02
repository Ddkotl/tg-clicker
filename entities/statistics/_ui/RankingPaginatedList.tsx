"use client";

import { useGetRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import { useTranslation } from "@/features/translations/use_translation";
import { RatingsMetrics, RatingsTypes } from "../_domain/types";
import { PaginationControl, PaginationControlSkeleton } from "@/shared/components/custom_ui/pagination";
import { ui_path } from "@/shared/lib/paths";
import { getRatingTitle } from "../_vm/get_rating_title";
import { GetBaseRank } from "../_vm/get_base_rank";
import { getRatingValue } from "../_vm/get_rating_value";
import { getRatingValueLable } from "../_vm/get_rating_value_lable";
import { RankingPaginatedListCard, RankingPaginatedListCardSkeleton } from "./RankingPaginatedListCard";

export function RankingPaginatedList({
  type,
  metric,
  page,
}: {
  type: RatingsTypes;
  metric: RatingsMetrics;
  page: number;
}) {
  const { language } = useTranslation();
  const { data, isLoading, isFetching } = useGetRatingsQuery(type, metric, page);

  if (!data || isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold capitalize opacity-50">{getRatingTitle({ metric, type, language })}</h2>

        {[...Array(10)].map((_, i) => (
          <RankingPaginatedListCardSkeleton key={i} />
        ))}

        <PaginationControlSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold capitalize">{getRatingTitle({ metric, type, language })}</h2>

      {data?.data.data.map((player, i) => {
        return (
          <RankingPaginatedListCard
            key={player.user?.id}
            userId={player.user?.id || ""}
            rank={GetBaseRank({ page, index: i })}
            img={player.user?.profile?.avatar_url ?? null}
            nickname={player.user?.profile?.nikname ?? null}
            valueLabel={getRatingValueLable({ metric, type, language })}
            value={getRatingValue({ metric, amount: player.amount })}
            isFetching={isFetching}
          />
        );
      })}

      {/* Пагинация (рендер только если есть данные) */}
      {!isLoading && data && (
        <PaginationControl
          basePath={ui_path.rankings_type_page(type, metric)}
          currentPage={data.data.page}
          pageSize={data.data.pageSize}
          totalItems={data.data.total}
          totalPages={data.data.pages}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}

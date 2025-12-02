"use client";
import Link from "next/link";
import { useGetRatingsQuery } from "../_queries/use_get_overall_ratings_query";
import { ui_path } from "@/shared/lib/paths";
import { icons } from "@/shared/lib/icons";
import { RankingCard, RankingCardSkeleton } from "./RankingCard";
import { useTranslation } from "@/features/translations/use_translation";
import { RatingsMetrics, RatingsTypes } from "../_domain/types";
import { getRatingValueLable } from "../_vm/get_rating_value_lable";
import { getRatingValue } from "../_vm/get_rating_value";
import { GetBaseRank } from "../_vm/get_base_rank";
import { getRatingTitle } from "../_vm/get_rating_title";

export function RankingList({ metric, type, page = 1 }: { metric: RatingsMetrics; type: RatingsTypes; page?: number }) {
  const { language } = useTranslation();
  const { data, isLoading, isFetching } = useGetRatingsQuery(type, metric, page);
  if (!data || isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full pb-4">
        <div className="flex justify-between items-center w-full">
          <div className="h-7 w-32 rounded bg-white/10 animate-pulse" />
          <div className="h-5 w-5 rounded bg-white/10 animate-pulse" />
        </div>

        <div className="grid grid-cols-3 gap-2 w-full">
          {[...Array(3)].map((_, i) => (
            <RankingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  const items = data.data.data.slice(0, 3);

  return (
    <div className="flex flex-col gap-2 w-full pb-4">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold capitalize">{getRatingTitle({ metric, type, language })}</h2>
        <Link
          href={ui_path.rankings_type_page(type, metric, 1)}
          className="underline text-sm opacity-80 hover:opacity-100"
        >
          {icons.arrow_right({})}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {items.map((player, i) => {
          return (
            <RankingCard
              key={player?.user?.id}
              userId={player?.user?.id || ""}
              rank={GetBaseRank({ page, index: i })}
              img={player?.user?.profile?.avatar_url ?? null}
              nickname={player?.user?.profile?.nikname ?? null}
              valueLabel={getRatingValueLable({ metric, type, language: language })}
              value={getRatingValue({ metric, amount: player.amount })}
              isFetching={isFetching}
            />
          );
        })}
      </div>
    </div>
  );
}

import { RatingsMetrics, RatingsTypes } from "@/entities/statistics/_domain/ratings_list_items";
import { RankingPaginatedList } from "@/entities/statistics/_ui/RankingPaginatedList";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ type: RatingsTypes; metric: RatingsMetrics }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams.page) || 1;

  return <RankingPaginatedList type={awaitedParams.type} metric={awaitedParams.metric} page={page} />;
}

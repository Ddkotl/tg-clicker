import { OverallRatingsMAP_Type } from "@/entities/statistics/_domain/ratings_list_items";

export default async function Page({ params, searchParams }: {
  params: { type: OverallRatingsMAP_Type }
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1;

  return <RankingPaginatedList type={params.type} page={page} />;
}

import {
  ratingMetrics,
  RatingsMetrics,
  RatingsTypes,
  ratingsTypes,
} from "@/entities/statistics/_domain/ratings_list_items";
import { RankingList } from "@/entities/statistics/_ui/RankingList";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { img_paths } from "@/shared/lib/img_paths";
import { headers } from "next/headers";

export default async function RankingPage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });
  return (
    <div className="flex flex-col gap-4">
      <PageDescription
        title={translate("ranking.title", lang)}
        highlight={translate("ranking.highlight", lang)}
        text={translate("ranking.text", lang)}
        img={img_paths.ranking_page()}
      />
      <Tabs defaultValue={ratingsTypes.overall}>
        <TabsList className="w-full grid grid-cols-2 h-auto">
          <TabsTrigger value={ratingsTypes.overall}>
            {translate("ranking.ratings.overall_game_rating", lang)}
          </TabsTrigger>
          <TabsTrigger value={ratingsTypes.monthly}>{translate("ranking.ratings.monthly", lang)}</TabsTrigger>
          <TabsTrigger value={ratingsTypes.weekly}>{translate("ranking.ratings.weekly", lang)}</TabsTrigger>
          <TabsTrigger value={ratingsTypes.daily}>{translate("ranking.ratings.daily", lang)}</TabsTrigger>
        </TabsList>
        <TabsContent value={ratingsTypes.overall}>
          {Object.values(ratingMetrics).map((m) => (
            <RankingList key={m} metric={m as RatingsMetrics} type={ratingsTypes.overall as RatingsTypes} />
          ))}
        </TabsContent>
        <TabsContent value={ratingsTypes.monthly}>
          {Object.values(ratingMetrics).map((m) => (
            <RankingList key={m} metric={m as RatingsMetrics} type={ratingsTypes.monthly as RatingsTypes} />
          ))}
        </TabsContent>
        <TabsContent value={ratingsTypes.weekly}>
          {Object.values(ratingMetrics).map((m) => (
            <RankingList key={m} metric={m as RatingsMetrics} type={ratingsTypes.weekly as RatingsTypes} />
          ))}
        </TabsContent>
        <TabsContent value={ratingsTypes.daily}>
          {Object.values(ratingMetrics).map((m) => (
            <RankingList key={m} metric={m as RatingsMetrics} type={ratingsTypes.daily as RatingsTypes} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

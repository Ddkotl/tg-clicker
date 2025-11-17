import { RankingList } from "@/entities/statistics/_ui/RatingList";
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
      <Tabs defaultValue="overall">
        <TabsList className="w-full">
          <TabsTrigger value="overall">{translate("ranking.ratings.overall_game_rating", lang)}</TabsTrigger>
          <TabsTrigger value="weekly">{translate("ranking.ratings.weekly", lang)}</TabsTrigger>
          <TabsTrigger value="daily">{translate("ranking.ratings.daily", lang)}</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <RankingList type="overall" />
        </TabsContent>
        <TabsContent value="weekly">weekly</TabsContent>
        <TabsContent value="daily">daiy</TabsContent>
      </Tabs>
    </div>
  );
}

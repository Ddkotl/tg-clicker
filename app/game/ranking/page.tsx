import { OverallRatingsMAP_KEYS } from "@/entities/statistics/_domain/ratings_list_items";
import { RankingList } from "@/entities/statistics/_ui/RankingList";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { icons } from "@/shared/lib/icons";
import { img_paths } from "@/shared/lib/img_paths";
import { ui_path } from "@/shared/lib/paths";
import { headers } from "next/headers";
import Link from "next/link";

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
          <RankingList type={OverallRatingsMAP_KEYS.exp} />
          {/* <Link href={ui_path.rankings_type_page(OverallRatingsMAP_KEYS.exp, 1)} className="underline">
            {icons.arrow_right({})}
          </Link> */}
        </TabsContent>
        <TabsContent value="weekly">weekly</TabsContent>
        <TabsContent value="daily">daiy</TabsContent>
      </Tabs>
    </div>
  );
}

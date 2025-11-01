import { DailyMissions } from "@/entities/missions/_ui/daily_missions";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";
import { headers } from "next/headers";

export default async function MisiionsPage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });

  return (
    <div className=" flex flex-col gap-3">
      <PageDescription
        title={translate("headquarter.missions.title", lang)}
        highlight={translate("headquarter.missions.highlight", lang)}
        text={translate("headquarter.missions.text", lang)}
        img={img_paths.mission()}
      />
      <DailyMissions />
    </div>
  );
}

import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { PageNav } from "@/shared/components/custom_ui/page_nav";
import { img_paths } from "@/shared/lib/img_paths";
import { nav_items } from "@/shared/lib/nav_items";
import { FactionConfrontationBar } from "@/entities/statistics/_ui/fraction_stats";
import { headers } from "next/headers";

export default async function Game() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });

  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      <PageDescription
        title={translate("home.ready_to_battle", lang)}
        text={`${translate("home.welcome_wanderer", lang)}!  ${translate("home.home_text", lang)}`}
        img={img_paths.home()}
      />

      <FactionConfrontationBar />
      <PageNav nav_items={nav_items.home_nav_items(translate, lang)} className="grid grid-cols-2 gap-2" />
    </div>
  );
}

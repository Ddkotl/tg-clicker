import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { PageNav } from "@/shared/components/custom_ui/page_nav";
import { img_paths } from "@/shared/lib/img_paths";
import { nav_items } from "@/shared/lib/nav_items";
import { headers } from "next/headers";

export default async function FightPage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });
  return (
    <div className=" flex flex-col gap-4">
      <PageDescription
        title={translate("home.navigation.battle", lang)}
        text={translate("fight.text", lang)}
        highlight={translate("fight.highlight", lang)}
        img={img_paths.fight()}
      />
      <PageNav nav_items={nav_items.fight_nav_items(translate, lang)} />
    </div>
  );
}

import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { PageNav } from "@/shared/components/custom_ui/page_nav";
import { img_paths } from "@/shared/lib/img_paths";
import { nav_items } from "@/shared/lib/nav_items";
import { headers } from "next/headers";

export default async function HeadquartersPage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });

  return (
    <div className=" flex flex-col gap-4">
      <PageDescription
        title={translate("home.navigation.headquarters", lang)}
        text={translate("headquarter.headquarter_welcome", lang)}
        img={img_paths.temple()}
      />
      <PageNav nav_items={nav_items.headquarter_page_nav_items(translate, lang)} />
    </div>
  );
}

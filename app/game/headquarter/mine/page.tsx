import Mine from "@/entities/mining/_ui/Mine";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";
import { headers } from "next/headers";

export default async function MinePage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });
  return (
    <div className="flex flex-col gap-2">
      <PageDescription
        img={img_paths.mining_cave()}
        title={translate("headquarter.mine_page.title", lang)}
        highlight={translate("headquarter.mine_page.highlight", lang)}
        text={translate("headquarter.mine_page.text", lang)}
      />
      <Mine />
    </div>
  );
}

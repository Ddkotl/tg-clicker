import { SpiritPathForm } from "@/entities/spirit_path/_ui/spirit_path_form";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";
import { headers } from "next/headers";

export default async function SpiritPathPage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });

  return (
    <div className=" flex flex-col gap-3">
      <PageDescription
        title={translate("headquarter.spirit_path.title", lang)}
        highlight={translate("headquarter.spirit_path.highlight", lang)}
        text={translate("headquarter.spirit_path.text", lang)}
        img={img_paths.spirit_path()}
      />

      <SpiritPathForm />
    </div>
  );
}

import { SwitchResurseces } from "@/features/bank/SwitchResurseces";
import { getCookieLang } from "@/features/translations/server/get_cookie_lang";
import { translate } from "@/features/translations/server/translate_fn";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { headers } from "next/headers";

export default async function BankPage() {
  const req_headers = await headers();
  const lang = getCookieLang({ headers: req_headers });
  return (
    <div className=" flex flex-col gap-4">
      <PageDescription
        title={translate("city.bank.title", lang)}
        text={translate("city.bank.description", lang)}
        // img={img_paths.temple()}
      />
      <SwitchResurseces />
    </div>
  );
}

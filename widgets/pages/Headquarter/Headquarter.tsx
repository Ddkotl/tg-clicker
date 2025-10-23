"use client";
import { useTranslation } from "@/features/translations/use_translation";
import { HeadquarterNav } from "./_ui/headquarter_nav";
import { PageDescription } from "@/shared/components/custom_ui/page_description";

export function Headquarter() {
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col gap-4">
      <PageDescription
        title={t("headquarter.headquarter_title")}
        highlight={t("mentor")}
        text={t("headquarter.headquarter_welcome")}
      />
      <HeadquarterNav t={t} />
    </div>
  );
}

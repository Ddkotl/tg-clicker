"use client";
import { useTranslation } from "@/features/translations/use_translation";
import { HeadquarterNav } from "./_ui/headquarter_nav";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";

export function Headquarter() {
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col gap-4">
      <PageDescription
        title={t("home.navigation.headquarters")}
        text={t("headquarter.headquarter_welcome")}
        img={img_paths.temple()}
      />
      <HeadquarterNav t={t} />
    </div>
  );
}

"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { FactsList } from "./facts_list";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";

export function Facts() {
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col gap-3">
      <PageDescription title={t("facts.fact_title")} text={t("facts.fact_description")} img={img_paths.facts()} />
      <FactsList t={t} />
    </div>
  );
}

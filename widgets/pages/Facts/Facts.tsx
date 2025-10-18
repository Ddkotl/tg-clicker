"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { FactsList } from "./_ui/facts_list";
import { FactsDescription } from "./_ui/facts_description";

export function Facts() {
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col gap-3">
      <FactsDescription t={t} />
      <FactsList t={t} />
    </div>
  );
}

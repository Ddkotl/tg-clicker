"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { CityDescription } from "./_ui/city_description";
import { CityNav } from "./_ui/city_nav";

export function City() {
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col gap-4">
      <CityDescription t={t} />
      <CityNav t={t} />
    </div>
  );
}

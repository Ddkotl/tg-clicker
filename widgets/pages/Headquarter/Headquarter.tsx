"use client";
import { useTranslation } from "@/features/translations/use_translation";
import { HeadquarterDescription } from "./_ui/headquarter_description";
import { HeadquarterNav } from "./_ui/headquarter_nav";

export function Headquarter() {
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col gap-4">
      <HeadquarterDescription t={t} />
      <HeadquarterNav t={t} />
    </div>
  );
}

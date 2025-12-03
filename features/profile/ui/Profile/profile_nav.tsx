"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { MainButton } from "@/shared/components/custom_ui/main-button";
import { nav_items } from "@/shared/lib/nav_items";
import { translate } from "@/features/translations/server/translate_fn";

interface ProfileButtonsProps {
  isMyProfile: boolean;
  userId: string;
  isLoading?: boolean;
}

export function ProfileNav({ isMyProfile, userId, isLoading }: ProfileButtonsProps) {
  const { language } = useTranslation();

  const buttons = nav_items.getProfileNavButtons(isMyProfile, userId, translate, language);
  return (
    <div className="flex flex-col gap-2">
      {buttons.map((btn) => (
        <MainButton key={btn.label} label={btn.label} href={btn.href} isLoading={isLoading} />
      ))}
    </div>
  );
}

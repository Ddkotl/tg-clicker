"use client";
import Image from "next/image";
import { useTranslation } from "@/features/translations/use_translation";

export function TelegramAuthLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center h-screen">
      <Image priority src="/loading.png" width={300} height={300} alt={t("loading")} />
    </div>
  );
}

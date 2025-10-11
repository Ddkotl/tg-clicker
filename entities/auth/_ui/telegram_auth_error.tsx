"use client";
import { useTranslation } from "@/features/translations/use_translation";

export function TelegramAuthError() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center space-y-4 p-8 text-red-500">
      <p>{t("auth_error")}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {t("auth_retry")}
      </button>
    </div>
  );
}

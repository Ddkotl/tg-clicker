"use client";

import Link from "next/link";
import { useTranslation } from "@/features/translations/use_translation";
import { Button } from "@/shared/components/ui/button";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen text-foreground flex flex-col items-center justify-center bg-radial-primary px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <h2 className="text-2xl font-bold">{t("errors.page_not_found")}</h2>
        <p className="text-sm text-muted-foreground">{t("errors.page_not_found_description")}</p>
        <Link href="/game">
          <Button size="lg" variant="default">
            {t("errors.go_back_to_game")}
          </Button>
        </Link>
      </div>
    </main>
  );
}

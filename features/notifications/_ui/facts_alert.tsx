"use client";

import { BellPlus, X } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { ui_path } from "@/shared/lib/paths";
import { useTranslation } from "@/features/translations/use_translation";

interface FactsAlertProps {
  count: number;
  onClose: () => void;
}

export function FactsAlert({ count, onClose }: FactsAlertProps) {
  const { t } = useTranslation();

  return (
    <Alert className="px-2 w-full justify-between py-1 shine-effect relative flex items-start gap-2 bg-card border border-border shadow-md rounded-lg">
      <div className="flex-1 flex gap-3">
        <BellPlus className="h-5 w-5 text-primary shrink-0" />
        <AlertTitle className="font-semibold">{`${t("facts.notification.new_events")} (${count})`}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <Link
            href={ui_path.facts_page()}
            onClick={onClose}
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
          >
            {t("facts.notification.сheck")}
          </Link>
        </AlertDescription>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}

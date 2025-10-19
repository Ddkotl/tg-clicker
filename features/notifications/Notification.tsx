"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, X } from "lucide-react";
import Link from "next/link";
import { Facts, FactsStatus } from "@/_generated/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { useGetSessionQuery } from "@/entities/auth";
import { api_path } from "@/shared/lib/paths";
import { useCheckAllFactsMutation } from "@/entities/facts";
import { useTranslation } from "../translations/use_translation";

export function Notifications() {
  const { t } = useTranslation();
  const [facts, setFacts] = useState<Facts[]>([]);
  const { data } = useGetSessionQuery();
  const mutation = useCheckAllFactsMutation();
  useEffect(() => {
    if (!data?.data?.user.userId) return;
    const userId = data?.data?.user.userId;

    const sse = new EventSource(api_path.facts_sse(userId));
    sse.onopen = () => console.log("✅ SSE connected for", userId);
    sse.onerror = (e) => console.warn("SSE error", e);
    sse.onmessage = (event) => {
      console.log("🔥 RAW SSE event:", event.data);
      const payload: Facts[] = JSON.parse(event.data);
      setFacts((prev) => [...prev, ...payload]);
    };

    sse.onerror = () => {
      console.warn("SSE connection closed");
      sse.close();
    };

    return () => sse.close();
  }, [data]);
  const handleCloseClick = () => {
    if (!data?.data?.user.userId) return;
    setFacts([]);
    mutation.mutate({
      userId: data?.data?.user.userId,
    });
  };
  // фильтруем только новые факты
  const newFacts = useMemo(() => facts.filter((f) => f.status === FactsStatus.NO_CHECKED), [facts]);

  if (newFacts.length === 0) return null;

  return (
    <Alert className="px-2 w-full justify-between py-1 shine-effect relative flex items-start gap-2 bg-card border border-border shadow-md rounded-lg">
      <div className="flex-1 flex gap-3">
        <Bell className="h-5 w-5 text-primary shrink-0 " />
        <AlertTitle className="font-semibold">{`${t("facts.notification.new_events")} (${newFacts.length})`}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <Link href="#" className="text-primary hover:text-primar/80 font-medium underline underline-offset-2">
            {t("facts.notification.сheck")}
          </Link>
        </AlertDescription>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={handleCloseClick}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}

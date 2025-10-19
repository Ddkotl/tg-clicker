"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, X } from "lucide-react";
import Link from "next/link";
import { Facts, FactsStatus } from "@/_generated/prisma";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { useGetSessionQuery } from "@/entities/auth";
import { api_path } from "@/shared/lib/paths";

export function Notifications() {
  const [facts, setFacts] = useState<Facts[]>([]);
  const { data } = useGetSessionQuery();

  useEffect(() => {
    const userId = data?.data?.user.userId;
    if (!userId) return;

    const sse = new EventSource(api_path.facts_sse(userId));
    sse.onopen = () => console.warn("SSE connected");
    sse.onerror = (e) => console.warn("SSE error", e);
    sse.onmessage = (event) => {
      console.warn("🔥 RAW SSE event:", event.data);
      try {
        const payload: Facts[] = JSON.parse(event.data);
        console.warn("📦 Parsed payload:", payload);
        setFacts((prev) => [...prev, ...payload]);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    sse.onerror = () => {
      console.warn("SSE connection closed");
      sse.close();
    };

    return () => sse.close();
  }, [data]);

  // фильтруем только новые факты
  const newFacts = useMemo(
    () => facts.filter((f) => f.status === FactsStatus.NO_CHECKED),
    [facts],
  );

  if (newFacts.length === 0) return null;

  return (
    <Alert className="px-2 w-full py-1 shine-effect relative flex items-start gap-2 bg-card border border-border shadow-md rounded-lg">
      <div className="flex-1 flex gap-3">
        <Bell className="h-5 w-5 text-primary shrink-0 " />
        <AlertTitle className="font-semibold">
          {`Есть новые события (${newFacts.length})`}
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <Link
            href="#"
            className="text-primary hover:text-primar/80 font-medium underline underline-offset-2"
          >
            Проверь.
          </Link>
        </AlertDescription>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => setFacts([])} // очищаем все факты и скрываем компонент
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Facts } from "@/_generated/prisma";
import { FactResponseType } from "@/entities/facts";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useFactsSSE(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    let retryTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      console.log("🔌 Connecting to SSE for", userId);
      const sse = new EventSource(api_path.facts_sse(userId), { withCredentials: false });

      sse.onopen = () => {
        console.log("✅ SSE connected for", userId);
        if (retryTimeout) {
          clearTimeout(retryTimeout);
          retryTimeout = null;
        }
      };

      sse.onmessage = (event) => {
        try {
          if (!event.data?.trim() || event.data === "ok") return;
          console.log("🔥 RAW SSE event:", event.data);
          const newFacts: Facts[] = JSON.parse(event.data);

          // Обновляем кэш react-query для этого пользователя
          queryClient.setQueryData<FactResponseType>(queries_keys.facts_userId(userId), (oldData) => {
            if (!oldData) {
              return { data: newFacts, message: "ok" };
            }

            const existingIds = new Set(oldData.data.map((f) => f.id));
            const mergedFacts = [...oldData.data, ...newFacts.filter((f) => !existingIds.has(f.id))];

            return { ...oldData, data: mergedFacts };
          });
        } catch (err) {
          console.error("SSE parse error:", err);
        }
      };

      sse.onerror = (e) => {
        console.warn("⚠️ SSE error, reconnecting in 3s...", e);
        sse.close();
        retryTimeout = setTimeout(connect, 3000);
      };

      return sse;
    };

    const sse = connect();
    return () => {
      console.log("🧹 Closing SSE connection for", userId);
      if (retryTimeout) clearTimeout(retryTimeout);
      sse.close();
    };
  }, [userId, queryClient]);
}

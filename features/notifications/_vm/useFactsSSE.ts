"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FactsType } from "@/_generated/prisma";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { pageSize } from "@/shared/game_config/facts/facts_const";

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
          const newFacts: FactsType[] = JSON.parse(event.data);
          newFacts.map((fact_type) => {
            queryClient.invalidateQueries({ queryKey: queries_keys.facts_userId(userId) });
            queryClient.invalidateQueries({ queryKey: [...queries_keys.facts_userId(userId), pageSize] });
            if (fact_type === FactsType.MEDITATION) {
              queryClient.invalidateQueries({ queryKey: queries_keys.meditation_userId(userId) });
            }
            if (fact_type === FactsType.SPIRIT_PATH) {
              queryClient.invalidateQueries({ queryKey: queries_keys.spirit_path_userId(userId) });
            }
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

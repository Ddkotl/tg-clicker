"use client";

import { FightResponseType } from "@/entities/fights";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateFightMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<FightResponseType, ErrorResponseType, { enemyType: string; fightType: string }>({
    mutationFn: async ({ enemyType, fightType }) => {
      const res = await fetch(api_path.create_fight(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enemyType, fightType }),
      });
      const ans = res.json();
      if (!res.ok) throw ans;
      return ans;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queries_keys.current_fight() }),
  });
};

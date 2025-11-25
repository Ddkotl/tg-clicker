"use client";

import { FightResponseType } from "@/entities/fights";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStartFightMutation = () => {
  return useMutation<FightResponseType, ErrorResponseType>({
    mutationFn: async () => {
      const res = await fetch(api_path.start_fight(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const ans = await res.json();
      if (!res.ok) throw ans;
      return ans as FightResponseType;
    },
  });
};

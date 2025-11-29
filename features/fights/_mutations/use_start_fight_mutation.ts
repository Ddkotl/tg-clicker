"use client";

import { FightResponseType } from "@/entities/fights";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStartFightMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<FightResponseType, ErrorResponseType>({
    mutationFn: async () => {
      const res = await fetch(api_path.start_fight(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const ans = await res.json();
      if (!res.ok) throw ans;
      return ans;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries_keys.profile_userId(data.data.attackerId) });
      queryClient.invalidateQueries({ queryKey: queries_keys.daily_missions_userId(data.data.attackerId) });
      queryClient.invalidateQueries({ queryKey: queries_keys.facts_userId(data.data.attackerId) });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

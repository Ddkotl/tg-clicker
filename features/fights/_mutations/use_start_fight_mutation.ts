"use client";

import { FightResponseType } from "@/entities/fights";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStartFightMutation = () => {
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
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

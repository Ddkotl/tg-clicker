import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetMeditationRewardErrorResponseType,
  GetMeditationRewardRequestType,
  GetMeditationRewardResponseType,
} from "../_domain/types";
import { queries_keys } from "@/shared/lib/queries_keys";
import { pageSize } from "@/shared/game_config/facts/facts_const";
import { ProfileResponse } from "@/entities/profile";

export function useGetMeditationReward() {
  const queryClient = useQueryClient();

  return useMutation<
    GetMeditationRewardResponseType,
    GetMeditationRewardErrorResponseType,
    GetMeditationRewardRequestType
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/headquarter/meditation/get_meditation_reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(data.data.userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            lvl: data.data.current_lvl,
            exp: data.data.current_exp,
            diamond: data.data.current_diamond,
            mana: data.data.current_mana,
          },
        };
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.meditation_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.facts_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queries_keys.facts_userId(data.data.userId), pageSize],
      });
    },
  });
}

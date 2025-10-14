import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GetMeditationRewardErrorResponseType,
  GetMeditationRewardRequestType,
  GetMeditationRewardResponseType,
} from "../_domain/types";

export function useGetMeditationReward() {
  const queryClient = useQueryClient();

  return useMutation<
    GetMeditationRewardResponseType,
    GetMeditationRewardErrorResponseType,
    GetMeditationRewardRequestType
  >({
    mutationFn: async (data) => {
      const res = await fetch(
        "/api/headquarter/meditation/get_meditation_reward",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await res.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", data.data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meditation", data.data.userId],
      });
    },
  });
}

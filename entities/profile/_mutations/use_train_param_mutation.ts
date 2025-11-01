import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileResponse, TrainErrorResponseType, TrainResponseType } from "../_domain/types";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useTrainParamMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<TrainResponseType, TrainErrorResponseType, string>({
    mutationFn: async (paramName: string) => {
      const res = await fetch(`/api/user/train?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramName }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if ("data" in data && data.data?.paramName && data.data?.newValue !== undefined) {
        const { paramName, newValue } = data.data;

        queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(userId), (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              [paramName as keyof typeof old.data]: newValue,
              qi: data.data.qi,
              max_hitpoint: data.data.max_hitpoint,
            },
          };
        });
      }
    },
  });
}

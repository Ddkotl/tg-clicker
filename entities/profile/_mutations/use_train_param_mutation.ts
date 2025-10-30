import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileResponse, TrainErrorResponseType, TrainResponseType } from "../_domain/types";

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

        queryClient.setQueryData<ProfileResponse>(["profile", userId], (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              [paramName as keyof typeof old.data]: newValue,
              qi: typeof data.data?.qi === "number" ? data.data.qi : old.data.qi,
              max_hitpoint:
                typeof data.data?.max_hitpoint === "number" ? data.data.max_hitpoint : old.data.max_hitpoint,
            },
          };
        });
      }
    },
  });
}

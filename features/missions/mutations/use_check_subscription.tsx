import { CheckSubscribeRequestType, CheckSubscribeResponseType } from "@/entities/missions/_domain/types";
import { ProfileResponse } from "@/entities/profile";
import { pageSize } from "@/shared/game_config/facts/facts_const";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCheckSubscription() {
  const queryClient = useQueryClient();

  return useMutation<CheckSubscribeResponseType, ErrorResponseType, CheckSubscribeRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.check_subscribe(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      return json;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(data.data.userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            spirit_cristal: data.data.spirit_cristal,
          },
        };
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.daily_missions_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.facts_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queries_keys.facts_userId(data.data.userId), pageSize],
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });
}

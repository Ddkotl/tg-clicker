import { api_path } from "@/shared/lib/paths";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckAllFactsErrorResponseType, CheckAllFactsRequestType, CheckAllFactsResponseType } from "../_domain/types";
import { queries_keys } from "@/shared/lib/queries_keys";
import { pageSize } from "@/shared/game_config/facts/facts_const";

export function useCheckAllFactsMutation() {
  const queryClient = useQueryClient();

  return useMutation<CheckAllFactsResponseType, CheckAllFactsErrorResponseType, CheckAllFactsRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.check_all_facts(data.userId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries_keys.facts_userId(data.data.userId) });
      queryClient.invalidateQueries({ queryKey: [...queries_keys.facts_userId(data.data.userId), pageSize] });
    },
  });
}

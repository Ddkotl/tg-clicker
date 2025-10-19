import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { useQueryClient } from "@tanstack/react-query";

export const getFactsQuery = (userId: string) => ({
  queryKey: queries_keys.facts_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(api_path.get_facts(userId), { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  },
});

export const useInvalidateFacts = () => {
  const queryClient = useQueryClient();

  return (userId: string) =>
    queryClient.invalidateQueries({
      queryKey: queries_keys.facts_userId(userId),
    });
};

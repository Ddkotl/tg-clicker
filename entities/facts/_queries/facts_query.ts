import { api_path } from "@/shared/lib/paths";
import { useQueryClient } from "@tanstack/react-query";

export const getFactsQuery = (userId: string) => ({
  queryKey: ["facts", userId],
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
      queryKey: ["facts", userId],
    });
};

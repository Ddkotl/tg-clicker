import { useQueryClient } from "@tanstack/react-query";

export const getSessionQuery = () => ({
  queryKey: ["session"],
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`/api/session`, { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch session");
    }
    return res.json();
  },
});

export const useInvalidateSession = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["session"],
    });
};

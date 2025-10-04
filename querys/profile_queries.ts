import { useQueryClient } from "@tanstack/react-query";

export const getProfileQuery = (userId: string) => ({
  queryKey: ["profile", userId],
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`api/user/profile?userId=${userId}`, { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  },
});

export const useInvalidateProfile = () => {
  const queryClient = useQueryClient();

  return (userId: string) =>
    queryClient.invalidateQueries({
      queryKey: ["profile", userId],
    });
};

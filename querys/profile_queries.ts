import { useQueryClient } from "@tanstack/react-query";

export const getProfileQuery = () => ({
  queryKey: ["profile"],
  queryFn: async () => {
    const res = await fetch("api/user/profile");
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  },
});

export const useInvalidateProfile = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["profile"],
    });
};

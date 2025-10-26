export const getMeditationInfoQuery = (userId: string) => ({
  queryKey: ["meditation", userId],
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`/api/headquarter/meditation${userId ? `?userId=${userId}` : ""}`, { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch meditation info");
    }
    return res.json();
  },
});

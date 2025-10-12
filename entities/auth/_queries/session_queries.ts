import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SessionErrorResponseType,
  SessionResponseType,
} from "../_domain/types";

export function useGetSessionQuery() {
  return useQuery<SessionResponseType | SessionErrorResponseType>({
    queryKey: ["session"],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const res = await fetch(`/api/session`, { signal });
      if (!res.ok) {
        throw new Error("Failed to fetch session");
      }
      return res.json();
    },
  });
}
export const useInvalidateGetSessionQuery = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["session"],
    });
};

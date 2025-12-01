import { useGetSessionQuery } from "@/entities/auth";
import { useProfileQuery } from "@/entities/profile";

export function useSomeQueries() {
  const session = useGetSessionQuery();
  const profile = useProfileQuery(session.data?.data?.user.userId || "");
  return { session, profile };
}

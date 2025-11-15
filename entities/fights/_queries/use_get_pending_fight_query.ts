import { useQuery } from "@tanstack/react-query";
import { FightResponseType } from "../_domain/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export const useCurrentFight = () => {
  return useQuery<FightResponseType>({
    queryKey: queries_keys.current_fight(),
    queryFn: async () => {
      const res = await fetch(api_path.get_current_fight());
      if (!res.ok) return null;
      return res.json();
    },
    gcTime: 1000,
    staleTime: 1000,
  });
};

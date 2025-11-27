import { useQuery } from "@tanstack/react-query";
import { FightResponseType } from "../_domain/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { FightStatus } from "@/_generated/prisma";

export const useGetFightQuery = ({ status, fightId }: { status?: FightStatus; fightId?: string }) => {
  return useQuery<FightResponseType>({
    queryKey: queries_keys.get_fight({ fightId, status }),
    queryFn: async () => {
      const res = await fetch(api_path.get_fight(fightId, status));
      if (!res.ok) return null;
      return res.json();
    },
  });
};

import { ProfileResponse } from "@/entities/profile";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankExchangeRequestType } from "../_domain/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";
import { toast } from "sonner";
import { useTranslation } from "@/features/translations/use_translation";

export function useBankExchangeMutation() {
  const { t } = useTranslation();
  const query_client = useQueryClient();
  return useMutation<ProfileResponse, ErrorResponseType, BankExchangeRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.bank_exchange(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      if (data.data?.userId) {
        query_client.invalidateQueries({ queryKey: queries_keys.profile_userId(data.data?.userId) });
      }
      toast.success(t("city.bank.success_exchange"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

import { useTranslation } from "@/features/translations/use_translation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RegistrationRequestType, RegistrationResponseType } from "../_domain/types";
import { toast } from "sonner";
import { api_path } from "@/shared/lib/paths";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";

export function useRegistrationMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation<RegistrationResponseType, ErrorResponseType, RegistrationRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.registration(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw json;
      }
      return json;
    },
    onSuccess: (data) => {
      toast.success(t("auth_congratulation", { nikname: data.data.nikname }), {
        position: "bottom-center",
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", data.data?.userId],
      });

      router.push("/game");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });
}

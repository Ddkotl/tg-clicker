import { useTranslation } from "@/features/translations/use_translation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  RegistrationErrorResponseType,
  RegistrationRequestType,
  RegistrationResponseType,
} from "../_domain/types";
import { toast } from "sonner";

export function useRegistrationMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation<
    RegistrationResponseType | RegistrationErrorResponseType,
    Error,
    RegistrationRequestType
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/auth/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Не удалось зарегестрироваться");
      return res.json();
    },
    onSuccess: (data) => {
      toast(t("auth_congratulation", { nikname: `${data.data?.nikname}` }));
      queryClient.invalidateQueries({
        queryKey: ["profile", data.data?.userId],
      });
      router.push("/game");
    },
  });
}

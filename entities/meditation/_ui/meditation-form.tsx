"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/translations/use_translation";
import { getHoursString } from "./getHoursString";
import { MeditatonFormSchema } from "../_domain/schemas";
import { useQuery } from "@tanstack/react-query";
import { getSessionQuery } from "@/querys/session_queries";
import { useGoMeditation } from "../_mutations/use_go_meditation_mutation";
import { getMeditationInfoQuery } from "../_queries/get_meditation_info_query";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function MeditationForm() {
  const { t } = useTranslation();

  // ====== ЗАПРОС СЕССИИ ======
  const { data: session, isLoading: isSessionLoading } = useQuery({
    ...getSessionQuery(),
  });

  // ====== ЗАПРОС МЕДИТАЦИИ ======
  const {
    data: meditation_info,
    isLoading: isMeditationLoading,
    refetch,
  } = useQuery({
    ...getMeditationInfoQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });

  // ====== ФОРМА ======
  const form = useForm<z.infer<typeof MeditatonFormSchema>>({
    resolver: zodResolver(MeditatonFormSchema),
    defaultValues: {
      time: "1",
    },
  });

  const meditationMutation = useGoMeditation();

  const onSubmit = (data: z.infer<typeof MeditatonFormSchema>) => {
    const userId = session?.data?.user.userId;
    if (!userId) {
      toast.error(t("auth_error"));
      return;
    }
    meditationMutation.mutate(
      { userId, hours: Number(data.time) },
      { onSuccess: () => refetch() },
    );
  };

  // ====== СОСТОЯНИЯ ======
  const isLoading = isSessionLoading || isMeditationLoading;
  const meditation = meditation_info?.data;

  const isMeditating = meditation?.on_meditation ?? false;
  let timeLeft: string | null = null;

  if (
    isMeditating &&
    meditation.start_meditation &&
    meditation.meditation_hours
  ) {
    const start = new Date(meditation.start_meditation).getTime();
    const end = start + meditation.meditation_hours * 60 * 60 * 1000;
    const now = Date.now();
    const diffMs = Math.max(end - now, 0);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    timeLeft = `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  }

  // ====== ЛОАДЕР ======
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative transition-opacity",
        (isMeditating || meditationMutation.isPending) &&
          "opacity-50 pointer-events-none",
      )}
    >
      {isMeditating && (
        <div className="mb-4 p-3 text-sm rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
          {t("headquarter.meditation_in_progress")}:{" "}
          {timeLeft
            ? `${timeLeft} ${t("headquarter.remaining")}`
            : t("headquarter.wait")}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("headquarter.meditation_time")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`1 ${t("hour.one")}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <SelectItem
                        key={(i + 1).toString()}
                        value={(i + 1).toString()}
                      >
                        {`${i + 1} ${t(`hour.${getHoursString(i + 1)}`)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={meditationMutation.isPending || isMeditating}
          >
            {t("headquarter.meditate")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

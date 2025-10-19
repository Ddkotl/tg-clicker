"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useTranslation } from "@/features/translations/use_translation";
import { getHoursString } from "../_vm/getHoursString";
import { MeditatonFormSchema } from "../_domain/schemas";
import { useQuery } from "@tanstack/react-query";
import { getMeditationInfoQuery } from "../_queries/get_meditation_info_query";
import { cn } from "@/shared/lib/utils";
import { useGetSessionQuery } from "@/entities/auth";
import { useGoMeditationMutation } from "../_mutations/use_go_meditation_mutation";
import { MeditationInfoResponse } from "../_domain/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { TranslationKey } from "@/features/translations/translate_type";
import { useEffect } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";

export function MeditationForm({ onTimeChange }: { onTimeChange?: (time: string) => void }) {
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();

  const {
    data: meditation_info,
    isLoading: isMeditationLoading,
    refetch,
  } = useQuery<MeditationInfoResponse>({
    ...getMeditationInfoQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });
  // const mutation = useGetMeditationReward();
  const form = useForm<z.infer<typeof MeditatonFormSchema>>({
    resolver: zodResolver(MeditatonFormSchema),
    defaultValues: {
      time: "1",
    },
  });
  const timeValue = form.watch("time");

  // useEffect(() => {
  //   if (!meditation_info?.data) return;

  //   const meditation = meditation_info.data;
  //   const start = meditation.start_meditation
  //     ? new Date(meditation.start_meditation).getTime()
  //     : 0;
  //   const end = start + (meditation.meditation_hours ?? 0) * 60 * 60 * 1000;
  //   const now = Date.now();

  //   if (meditation.on_meditation && now >= end && meditation.userId) {
  //     mutation.mutate({ userId: meditation.userId });
  //   }
  // }, [meditation_info, mutation]);

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(timeValue);
    }
  }, [timeValue, onTimeChange]);

  const meditationMutation = useGoMeditationMutation();

  const onSubmit = (data: z.infer<typeof MeditatonFormSchema>) => {
    const userId = session?.data?.user.userId;
    if (!userId) {
      toast.error(t("auth_error"));
      return;
    }
    meditationMutation.mutate({ userId, hours: Number(data.time) }, { onSuccess: () => refetch() });
  };

  const isLoading = isSessionLoading || isMeditationLoading;
  const meditation = meditation_info?.data;

  const isMeditating = meditation?.on_meditation ?? false;
  let end: number | null = null;

  if (isMeditating && meditation?.start_meditation && meditation?.meditation_hours) {
    const start = new Date(meditation.start_meditation).getTime();
    end = start + meditation.meditation_hours * 60 * 60 * 1000;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6  text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {isMeditating && (
        <div className="p-3 text-sm shine-effect rounded-md  bg-primary/70  text-foreground/80  flex gap-2 items-center">
          <span>{t("headquarter.meditation_in_progress")}: </span>
          {end && <CountdownTimer endTime={end} label={t("headquarter.remaining")} />}
        </div>
      )}
      <div
        className={cn(
          "relative transition-opacity",
          (isMeditating || meditationMutation.isPending) && "opacity-50 pointer-events-none",
        )}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
                        <SelectItem key={(i + 1).toString()} value={(i + 1).toString()}>
                          {`${i + 1} ${t(`hour.${getHoursString(i + 1)}` as TranslationKey)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={meditationMutation.isPending || isMeditating}>
              {t("headquarter.meditate")}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

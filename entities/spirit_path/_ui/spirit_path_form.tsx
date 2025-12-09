"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useTranslation } from "@/features/translations/use_translation";
import { useQuery } from "@tanstack/react-query";
import { SpiritPathInfoResponseType } from "../_domain/types";
import { getSpiritPathInfoQuery } from "../_queries/get_spirit_path_info_query";
import { useForm, useWatch } from "react-hook-form";
import { spiritPathFormSchema, spititPathTimeOptions } from "../_domain/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoSpiritPathMutation } from "../_mutations/use_go_spirit_path_mutation";
import z from "zod";
import { toast } from "sonner";
import { Spinner } from "@/shared/components/ui/spinner";
import { SpiritPathInProgress } from "./spirit_path_in_progress";
import { cn } from "@/shared/lib/utils";
import dayjs from "dayjs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { useCheckUserDealsStatus } from "@/entities/user/_queries/use_check_user_deals";

export function SpiritPathForm() {
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  const { data: spiritInfo, isLoading: isSpiritPathLoading } = useQuery<SpiritPathInfoResponseType>({
    ...getSpiritPathInfoQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });

  const userDeals = useCheckUserDealsStatus();

  const form = useForm<z.infer<typeof spiritPathFormSchema>>({
    resolver: zodResolver(spiritPathFormSchema),
    defaultValues: { time: "10" },
  });

  const timeValue = useWatch({
    control: form.control,
    name: "time",
  });

  const mutation = useGoSpiritPathMutation();

  const onSubmit = (data: z.infer<typeof spiritPathFormSchema>) => {
    const userId = session?.data?.user.userId;
    if (!userId) return toast.error(t("auth_error"));
    mutation.mutate({ userId, minutes: Number(data.time) });
  };

  const isSameDay = dayjs(spiritInfo?.data?.date_today).isSame(new Date(), "day") ?? false;
  const minutesToday = isSameDay ? (spiritInfo?.data?.minutes_today ?? 0) : 0;
  const minutesLeftToday = Math.max(480 - minutesToday, 0);

  const spiritPath = spiritInfo?.data;
  const isSpiritPath = spiritPath?.on_spirit_paths ?? false;

  let end: number | null = null;
  if (isSpiritPath && spiritPath?.start_spirit_paths && spiritPath?.spirit_paths_minutes) {
    const start = new Date(spiritPath.start_spirit_paths).getTime();
    end = start + spiritPath.spirit_paths_minutes * 60 * 1000;
  }

  const isLoading = isSessionLoading || isSpiritPathLoading;

  if (isLoading || !session?.data?.user.userId) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {isSpiritPath && <SpiritPathInProgress t={t} end={end} userId={session.data.user.userId} />}

      <div
        className={cn(
          "relative transition-opacity",
          (mutation.isPending || userDeals.busy || minutesLeftToday === 0) && "opacity-50 pointer-events-none",
        )}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("headquarter.spirit_path.select_spirit_path_time")}</FormLabel>
                  <Select onValueChange={field.onChange} value={timeValue} disabled={minutesLeftToday === 0}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`${timeValue} ${t("minutes")}`} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {spititPathTimeOptions
                        .filter((value) => Number(value) <= minutesLeftToday)
                        .map((value) => (
                          <SelectItem key={value} value={value}>
                            {value} {t("minutes")}
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
              disabled={mutation.isPending || isSpiritPath || userDeals.busy || minutesLeftToday === 0}
            >
              {minutesLeftToday === 0
                ? t("headquarter.spirit_path.no_minutes_left")
                : userDeals.busy
                  ? userDeals.reason
                  : t("headquarter.spirit_path.start_spirit_path")}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

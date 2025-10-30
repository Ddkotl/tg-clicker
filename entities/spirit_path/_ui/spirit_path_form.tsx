"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useTranslation } from "@/features/translations/use_translation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SpiritPathInfoResponseType } from "../_domain/types";
import { getSpiritPathInfoQuery } from "../_queries/get_spirit_path_info_query";
import { useForm } from "react-hook-form";
import { spiritPathFormSchema, spititPathTimeOptions } from "../_domain/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoSpiritPathMutation } from "../_mutations/use_go_spirit_path_mutation";
import z from "zod";
import { toast } from "sonner";
import { Spinner } from "@/shared/components/ui/spinner";
import { SpiritPathInProgress } from "./spirit_path_in_progress";
import { cn } from "@/shared/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";

export function SpiritPathForm() {
  const [selectedMinutes, setSelectedMinutes] = useState("10");
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  console.log("selectedMinutes", selectedMinutes);
  const { data: spirit_path_info, isLoading: isSpiritPathLoading } = useQuery<SpiritPathInfoResponseType>({
    ...getSpiritPathInfoQuery(session?.data?.user.userId ?? ""),
    enabled: !!session?.data?.user.userId,
  });
  const form = useForm<z.infer<typeof spiritPathFormSchema>>({
    resolver: zodResolver(spiritPathFormSchema),
    defaultValues: {
      time: "10",
    },
  });
  const timeValue = form.watch("time");

  useEffect(() => {
    setSelectedMinutes(timeValue);
  }, [timeValue, setSelectedMinutes]);

  const mutation = useGoSpiritPathMutation();

  const onSubmit = (data: z.infer<typeof spiritPathFormSchema>) => {
    const userId = session?.data?.user.userId;
    if (!userId) {
      toast.error(t("auth_error"));
      return;
    }
    mutation.mutate({ userId, minutes: Number(data.time) });
  };
  const minutes_today = spirit_path_info?.data?.minutes_today ?? 0;
  const minutesLeftToday = Math.max(480 - minutes_today, 0);
  const isLoading = isSessionLoading || isSpiritPathLoading;
  const spirit_path = spirit_path_info?.data;

  const isSpiritPath = spirit_path?.on_spirit_paths ?? false;
  let end: number | null = null;

  if (isSpiritPath && spirit_path?.start_spirit_paths && spirit_path?.spirit_paths_minutes) {
    const start = new Date(spirit_path.start_spirit_paths).getTime();
    end = start + spirit_path.spirit_paths_minutes * 60 * 1000;
  }

  if (isLoading || !session?.data?.user.userId) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6  text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* {isSpiritPath && <SpiritPathInProgress t={t} end={end} userId={session?.data?.user.userId} />} */}
      <div
        className={cn(
          "relative transition-opacity",
          (isSpiritPath || mutation.isPending) && "opacity-50 pointer-events-none",
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`${form.getValues("time")} ${t("minutes")}`} />
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
            <Button type="submit" disabled={mutation.isPending || isSpiritPath}>
              {t("headquarter.spirit_path.start_spirit_path")}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

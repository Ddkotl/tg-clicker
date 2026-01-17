"use client";

import { useForm } from "react-hook-form";
import { BankExchangeRequestType } from "../_domain/types";
import { useBankExchangeMutation } from "../_mutation/use_bank_exchange_mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankExchangeRequestSchema } from "../_domain/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { CRISTAL_COST, STONE_COST } from "@/shared/game_config/bank/bank";
import { icons } from "@/shared/lib/icons";
import { useTranslation } from "@/features/translations/use_translation";

export function BankExchangeForm({ exchange_type }: { exchange_type: "stones_to_cristals" | "cristals_to_stones" }) {
  const { t } = useTranslation();
  const form = useForm<BankExchangeRequestType>({
    resolver: zodResolver(bankExchangeRequestSchema),
    defaultValues: {
      exchangeType: exchange_type,
      amount: 10,
    },
  });
  const mutation = useBankExchangeMutation();

  const exchangeType = form.watch("exchangeType");
  const amount = form.watch("amount");
  const costNode =
    exchangeType === "stones_to_cristals" ? (
      <span className="flex items-center gap-1">
        {amount}
        {icons.stone({ className: "h-4 w-4" })}
        <span>→</span>
        {Math.floor(amount / CRISTAL_COST)}
        {icons.crystal({ className: "h-4 w-4" })}
      </span>
    ) : (
      <span className="flex items-center gap-1">
        {amount}
        {icons.crystal({ className: "h-4 w-4" })}
        <span>→</span>
        {amount * STONE_COST}
        {icons.stone({ className: "h-4 w-4" })}
      </span>
    );
  const submitHandler = form.handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <Form {...form}>
      <form onSubmit={submitHandler} className="flex flex-col gap-4 w-full">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("amount")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-muted-foreground">{costNode}</div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {t("exchange")}
        </Button>
      </form>
    </Form>
  );
}

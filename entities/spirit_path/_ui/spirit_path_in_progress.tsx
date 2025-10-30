"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogTrigger } from "@/shared/components/ui/dialog";
import { useState } from "react";
import { useGetSpiritPathReward } from "../_mutations/use_get_spirit_path_reward";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Gem } from "lucide-react";

interface SpiritPathInProgressProps {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  end: number | null;
  userId: string;
}

export function SpiritPathInProgress({ t, end, userId }: SpiritPathInProgressProps) {
  const mutation = useGetSpiritPathReward();
  const [open, setOpen] = useState(false);

  const handleConfirmCancel = () => {
    mutation.mutate({ userId, break_spirit_path: true });
    setOpen(false);
  };

  return (
    <div className="p-1 text-sm rounded-md bg-primary/70 text-foreground/80 flex justify-between gap-2 items-center">
      <div className="flex gap-1 px-2">
        <span>{t("headquarter.meditation_in_progress")}: </span>
        {end != null && <CountdownTimer endTime={end} />}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            {mutation.isPending ? t("canceling") : t("cancel")}
          </Button>
        </DialogTrigger>

        {open && (
          <div className="absolute top-1/2 -translate-y-1/2 mt-2 left-1/2 -translate-x-1/2 bg-background border border-primary/50 rounded-xl shadow-lg p-4 max-w-[400px] z-10">
            <DialogHeader>
              <DialogTitle>{t("headquarter.spirit_path.cancel_spirit_path")}</DialogTitle>
              <DialogDescription className="indent-6 w-full text-justify  items-center gap-1">
                {t("headquarter.spirit_path.cancel_spirit_path_confirm1")}
                {/* <Gem className=" h-4 text-purple-500 inline" />
                {t("headquarter.cancel_meditation_confirm2")} */}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <Button className="bg-primary" onClick={handleConfirmCancel} disabled={mutation.isPending}>
                {mutation.isPending ? t("canceling") : t("confirm")}
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}

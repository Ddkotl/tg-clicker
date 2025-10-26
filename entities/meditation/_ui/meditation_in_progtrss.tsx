"use client";

import { useState } from "react";
import { TranslationKey } from "@/features/translations/translate_type";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { useGetMeditationReward } from "../_mutations/use_get_meditation_reward";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Gem } from "lucide-react";

interface MeditationInProgressProps {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  end: number | null;
  userId: string;
}

export function MeditationInProgress({ t, end, userId }: MeditationInProgressProps) {
  const mutation = useGetMeditationReward();
  const [open, setOpen] = useState(false);

  const handleConfirmCancel = () => {
    mutation.mutate({ userId, break_meditation: true });
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

        <DialogContent className="sm:max-w-[400px] max-w-[400px]">
          {" "}
          {/* ограничиваем ширину модалки */}
          <DialogHeader>
            <DialogTitle>{t("headquarter.cancel_meditation")}</DialogTitle>
            <DialogDescription className="indent-6 w-full text-justify  items-center gap-1">
              {t("headquarter.cancel_meditation_confirm1")}
              <Gem className=" h-4 text-purple-500 inline" />
              {t("headquarter.cancel_meditation_confirm2")}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

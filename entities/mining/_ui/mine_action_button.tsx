import { Button } from "@/shared/components/ui/button";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/lib/utils";
import * as MiningConst from "@/shared/game_config/mining/mining_const";
import { useTranslation } from "@/features/translations/use_translation";

interface MineActionButtonProps {
  energy: number;
  now: Date;
  lastMineAt: number;
  isPending: boolean;
  onMine: () => void;
  onCooldownEnd: () => void;
  onMeditation: boolean;
}

export const MineActionButton = ({
  energy,
  now,
  lastMineAt,
  isPending,
  onMine,
  onCooldownEnd,
  onMeditation,
}: MineActionButtonProps) => {
  const { t } = useTranslation();
  const isCooldown = now.getTime() < lastMineAt + MiningConst.MINE_COOLDOWN;

  const disabled = energy < 0 || isCooldown || isPending || onMeditation;

  return (
    <Button
      className={cn(
        "w-full flex items-center justify-center gap-2 transition-opacity py-4",
        disabled && "pointer-events-none opacity-40",
      )}
      size="lg"
      disabled={disabled}
      onClick={onMine}
    >
      {onMeditation ? (
        <span>{t("headquarter.mine_page.cannot_mine_while_meditating")}</span>
      ) : (
        <div className="flex items-center gap-2">
          {isCooldown && <CountdownTimer endTime={lastMineAt + MiningConst.MINE_COOLDOWN} onComplete={onCooldownEnd} />}
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              {t("headquarter.mine_page.mining_in_progress")}
            </div>
          ) : (
            t("headquarter.mine_page.get_qi_stones")
          )}
        </div>
      )}
    </Button>
  );
};

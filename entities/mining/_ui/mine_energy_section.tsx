import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { Progress } from "@/shared/components/ui/progress";
import { useTranslation } from "@/features/translations/use_translation";
import * as MiningConst from "@/shared/game_config/mining/mining_const";
import { icons } from "@/shared/lib/icons";

interface MineEnergySectionProps {
  energy: number;
  lastEnergyAt: number;
  onEnergyRecovered: () => void;
}

export const MineEnergySection = ({ energy, lastEnergyAt, onEnergyRecovered }: MineEnergySectionProps) => {
  const { t } = useTranslation();
  const percent = (energy / MiningConst.MAX_ENERGY) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className=" text-sm text-muted-foreground">
          <span className="flex gap-1 font-medium text-foreground">
            {icons.mine({})}
            {energy}/{MiningConst.MAX_ENERGY}
          </span>
        </p>

        {energy < MiningConst.MAX_ENERGY && (
          <CountdownTimer
            endTime={lastEnergyAt + MiningConst.ENERGY_RECHARGE_INTERVAL}
            label={t("headquarter.mine_page.energy_recovery")}
            onComplete={onEnergyRecovered}
          />
        )}
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
};

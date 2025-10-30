"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";
import { useTranslation } from "@/features/translations/use_translation";
import { useMineData } from "../_vm/use_mine_data";
import { Spinner } from "@/shared/components/ui/spinner";
import { MineEnergySection } from "./mine_energy_section";
import { MineActionButton } from "./mine_action_button";

export default function Mine() {
  const { t } = useTranslation();
  const { isLoading, mine, userId, mutation, refetch, now, setNow, energy, deals } = useMineData();

  if (isLoading || !mine?.data.last_energy_at || !mine?.data.last_mine_at) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <PageDescription
        img={img_paths.mining_cave()}
        title={t("headquarter.mine_page.title")}
        highlight={t("headquarter.mine_page.highlight")}
        text={t("headquarter.mine_page.text")}
      />

      <div className="max-w-md mx-auto w-full">
        <Card className="shadow-lg border-border/50 bg-card/70 backdrop-blur p-1">
          <CardContent className="text-center space-y-3 p-3">
            <MineEnergySection energy={energy} lastEnergyAt={mine.data.last_energy_at} onEnergyRecovered={refetch} />

            <MineActionButton
              energy={energy}
              now={now}
              lastMineAt={mine.data.last_mine_at}
              isPending={mutation.isPending}
              onMine={() => mutation.mutate({ userId: userId ?? "" })}
              onCooldownEnd={() => setNow(new Date())}
              busy={deals.busy}
              busyReason={deals.reason}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

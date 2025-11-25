"use client";

import Image from "next/image";
import { FighterSnapshot } from "../_domain/types";
import { img_paths } from "@/shared/lib/img_paths";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

type Props = {
  fighter: FighterSnapshot;
};

export const FighterCard = ({ fighter }: Props) => {
  return (
    <Card className="p-1 gap-2 w-full  overflow-hidden border">
      <CardHeader className="p-1 flex flex-col items-center space-y-2 pb-2">
        <Image
          src={fighter.avatar_url}
          alt={fighter.name}
          width={110}
          height={110}
          className="rounded-full border shadow"
        />

        <CardTitle className="text-sm font-medium text-center truncate max-w-[90%]">{fighter.name}</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-1 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2 text-muted-foreground">
          <p>⚔️ Power:</p>
          <p className="text-right text-foreground font-medium">{fighter.power}</p>

          <p>🛡 Protection:</p>
          <p className="text-right text-foreground font-medium">{fighter.protection}</p>

          <p>🎯 Skill:</p>
          <p className="text-right text-foreground font-medium">{fighter.skill}</p>

          <p>⚡ Speed:</p>
          <p className="text-right text-foreground font-medium">{fighter.speed}</p>
          <p>⚡ qi_param:</p>
          <p className="text-right text-foreground font-medium">{fighter.qi_param}</p>
        </div>
      </CardContent>
    </Card>
  );
};

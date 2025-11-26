"use client";

import Image from "next/image";
import { FighterSnapshot } from "../_domain/types";
import { img_paths } from "@/shared/lib/img_paths";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useTranslation } from "@/features/translations/use_translation";
import { GenerateParamsConfig } from "@/shared/game_config/params/params_cost";

type Props = {
  fighter: FighterSnapshot;
};

export const FighterCard = ({ fighter }: Props) => {
  const { language } = useTranslation();
  const params = Object.values(GenerateParamsConfig({ lang: language }));
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
        <div className="flex flex-col gap-2 text-muted-foreground">
          {params.map((param) => {
            return (
              <div key={param.name} className="flex gap-2 items-center justify-between w-full text-muted-foreground">
                <div className="flex gap-2 items-center justify-start">
                  <Image
                    className="object-fill h-5 w-5"
                    src={param.icon || ""}
                    alt={param.title ?? param.name}
                    width={10}
                    height={10}
                  />
                  <span>{param.title}:</span>{" "}
                </div>
                <span className="text-right text-foreground font-medium">
                  {fighter[param.name as keyof FighterSnapshot]}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

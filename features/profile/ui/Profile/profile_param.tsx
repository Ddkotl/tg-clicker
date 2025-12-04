"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface IconProps {
  className?: string;
}

interface ProfileParamProps {
  label: string;
  value: string | number;
  imgSrc?: string;
  icon?: (props: IconProps) => React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function ProfileParam({ label, value, imgSrc, icon, className, iconClassName }: ProfileParamProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {imgSrc && <Image src={imgSrc} alt={label} width={32} height={32} className="rounded-sm" />}

      {!imgSrc && icon && <div>{icon({ className: cn(`w-5 h-5 m-1.5 `, iconClassName) })}</div>}

      <span className="text-muted-foreground text-sm xs:text-base">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

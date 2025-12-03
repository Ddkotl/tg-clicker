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
}

export function ProfileParam({ label, value, imgSrc, icon, className }: ProfileParamProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {imgSrc && <Image src={imgSrc} alt={label} width={32} height={32} className="rounded-sm" />}

      {!imgSrc && icon && icon({ className: "w-6 h-6" })}

      <span className="text-muted-foreground text-sm xs:text-base">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

"use client";

import { MainButton } from "@/shared/components/custom_ui/main-button";
import { HomeNavItemType } from "../_domain/types";

export function HomeNav({ items }: { items: HomeNavItemType[] }) {
  return (
    <div className={`grid grid-cols-2 gap-3 transition-opacity duration-200 `}>
      {items.map((item) => (
        <MainButton key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  );
}

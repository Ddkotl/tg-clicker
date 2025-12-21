import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import type { FooterItemType } from "../_domain/types";
import { Soon } from "@/shared/components/custom_ui/Soon";
import { Counter } from "@/shared/components/custom_ui/counter";

export function FooterItem({
  item,
  disabled,
  count,
  soon,
}: {
  item: FooterItemType;
  disabled?: boolean;
  count?: number;
  soon?: string;
}) {
  return (
    <Link
      key={item.id}
      href={item.url}
      className={cn(
        "flex flex-col items-center transition-opacity duration-200 hover:opacity-80",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="relative">
        <item.Icon className="w-7 h-7 xs:h-8 xs:w-8 text-foreground/70" />

        {count && count >= 0 && <Counter count={count} />}

        {soon && <Soon soon={soon} />}
      </div>
      <span className="text-xs xs:text-base font-medium text-foreground/70">{item.label}</span>
    </Link>
  );
}

import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import type { FooterItemType } from "../_domain/types";
import { Badge } from "@/shared/components/ui/badge";

export function FooterItem({ item, disabled, count }: { item: FooterItemType; disabled?: boolean; count?: number }) {
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

        {count && count >= 0 && (
          <Badge className="absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary animate-pulse px-1 text-[12px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </div>
      <span className="text-xs xs:text-base font-medium text-foreground/70">{item.label}</span>
    </Link>
  );
}

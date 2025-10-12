import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import type { FooterItemType } from "../_domain/types";

export function FooterItem({
  item,
  disabled,
}: {
  item: FooterItemType;
  disabled?: boolean;
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
      <item.Icon className="w-7 h-7 xs:h-8 xs:w-8 text-foreground/70" />
      <span className="text-xs xs:text-base font-medium text-foreground/70">
        {item.label}
      </span>
    </Link>
  );
}

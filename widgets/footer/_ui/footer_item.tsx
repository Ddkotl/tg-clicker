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
      <item.Icon className="w-6 h-6 text-primary/80" />
      <span className="text-xs font-medium text-primary/70">{item.label}</span>
    </Link>
  );
}

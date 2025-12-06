import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

export function Counter({ count, className }: { count: number; className?: string }) {
  return (
    <Badge
      className={cn(
        "absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary  px-1 text-[12px] font-bold text-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}

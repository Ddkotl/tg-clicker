import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

export function HeaderItem({
  icon: Icon,
  value,
  color,
  isLoading,
  isDisabled,
  href,
}: {
  icon: React.ElementType;
  value?: string | number;
  color?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex justify-center items-center gap-1 transition-colors duration-200 hover:opacity-80 cursor-pointer",
        isDisabled && "pointer-events-none opacity-50",
      )}
    >
      <Icon className={cn("h-4 w-4", color)} />
      {isLoading && value ? (
        <Skeleton className="h-3 w-8 rounded-md" />
      ) : (
        <>
          <span className="text-sm font-medium">{value ?? 0}</span>
        </>
      )}
    </Link>
  );
}

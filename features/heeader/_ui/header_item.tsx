import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

export function HeaderItem({
  icon,
  value,
  isLoading,
  isDisabled,
  href,
}: {
  icon: React.ReactNode;
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
        "flex justify-center items-center  transition-colors duration-200 hover:opacity-80 cursor-pointer",
        isDisabled && "pointer-events-none opacity-50",
        value && "gap-1",
      )}
    >
      {icon}
      {isLoading && value ? (
        <Skeleton className="h-3 w-8 rounded-md" />
      ) : (
        <span className="text-sm xs:text-base  font-medium">{value}</span>
      )}
    </Link>
  );
}

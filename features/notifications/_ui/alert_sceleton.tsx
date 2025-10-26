import { Alert } from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function AlertSceleton() {
  return (
    <Alert className="px-2 w-full py-2 flex items-center gap-3 bg-card border border-border shadow-md rounded-lg">
      <Skeleton className="h-5 w-5 rounded-full" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-5 w-5 rounded-md" />
    </Alert>
  );
}

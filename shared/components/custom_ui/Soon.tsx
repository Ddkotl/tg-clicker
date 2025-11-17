import { Badge } from "../ui/badge";

export function Soon({ soon }: { soon: string }) {
  return (
    <Badge className="absolute -top-1 -right-2 flex h-5 min-w-10 items-center justify-center rounded-sm bg-background animate-pulse px-1 text-[12px] font-bold text-white">
      {soon}
    </Badge>
  );
}

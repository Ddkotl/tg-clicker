import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
    </div>
  );
}

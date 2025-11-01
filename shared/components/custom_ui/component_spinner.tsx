import { Spinner } from "../ui/spinner";

export function ComponentSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <Spinner className="w-6 h-6 text-muted-foreground" />
    </div>
  );
}

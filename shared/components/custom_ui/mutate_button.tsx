import { Button } from "@/shared/components/ui/button";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/lib/utils";

export const MutateButton = ({
  isDisabled,
  isCooldown,
  isBusy,
  busyReason,
  handleCooldownEnd,
  cooldownEndMs,
  mutate,
  isMutatePending,
  actionText,
  pendingText,
}: {
  isDisabled?: boolean;
  isCooldown?: boolean;
  isBusy?: boolean;
  busyReason?: string;
  handleCooldownEnd?: () => void;
  cooldownEndMs?: number;
  mutate: () => void;
  isMutatePending: boolean;
  actionText: string;
  pendingText?: string;
}) => {
  return (
    <Button
      className={cn(
        "w-full flex items-center justify-center gap-2 transition-opacity py-4",
        isDisabled && "pointer-events-none opacity-40",
      )}
      size="lg"
      disabled={isDisabled}
      onClick={mutate}
    >
      {isBusy ? (
        <span>{busyReason}</span>
      ) : (
        <div className="flex items-center gap-2">
          {isCooldown && cooldownEndMs && <CountdownTimer endTime={cooldownEndMs} onComplete={handleCooldownEnd} />}
          {isMutatePending ? (
            <div className="flex items-center gap-2">
              <Spinner />
              {pendingText}
            </div>
          ) : (
            actionText
          )}
        </div>
      )}
    </Button>
  );
};

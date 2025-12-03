import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { getProfileLetters } from "../_vm/get_profile_letters";
import { cn } from "@/shared/lib/utils";

export function ProfileAvatar({
  avatarUrl,
  nickname,
  className,
}: {
  avatarUrl?: string;
  nickname?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("w-28 h-28", className)}>
      <AvatarImage src={avatarUrl || ""} />
      <AvatarFallback>{getProfileLetters(nickname || "")}</AvatarFallback>
    </Avatar>
  );
}

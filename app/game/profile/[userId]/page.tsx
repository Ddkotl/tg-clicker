import { PlayerProfile } from "@/features/profile/ui/Profile/PlayerProfile";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const awaited_params = await params;
  return <PlayerProfile userId={awaited_params.userId} />;
}

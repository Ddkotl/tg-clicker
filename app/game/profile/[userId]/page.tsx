import { Profile } from "@/features/profile/ui/Profile/Profile";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const awaited_params = await params;
  return <Profile userId={awaited_params.userId} />;
}

"use client";
import { init, openTelegramLink } from "@telegram-apps/sdk";
import { useQuery } from "@tanstack/react-query";
import { ReferralResponse } from "@/app/api/referrals/route";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { toast } from "sonner";

export function ReferralSystem() {
  const referrals = useQuery<ReferralResponse>({
    queryKey: ["referrals"],
    queryFn: async () => {
      const response = await fetch(`/api/referrals`);
      if (!response.ok) throw new Error("Failed to fetch referrals");
      return response.json();
    },
  });

  if (referrals.isLoading) {
    return <ComponentSpinner />;
  }
  if (!referrals.data?.data.referrals) {
    return <div>No referrals found.</div>;
  }
  const inviteLink = `https://t.me/Qi_Wars_Bot?startapp=${referrals.data?.data.telegram_id}`;
  const handleInviteFriend = () => {
    init();
    // const inviteLink = `${process.env.REFERAL_INVITE_URL}?startapp=${referrals.data?.data.telegram_id}`;
    const shareText = `Join me on this awesome Telegram mini app!`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
    openTelegramLink(fullUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-md">
      {referrals.data?.data.referrer && (
        <p className="text-green-500 mb-4">You were referred by user {referrals.data?.data.referrer.nikname}</p>
      )}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Invite Friend
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Invite Link
        </button>
      </div>
      {referrals.data?.data.referrals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
          <ul>
            {referrals.data?.data.referrals.map((referral, index) => (
              <li key={index} className="bg-gray-100 p-2 mb-2 rounded">
                User {referral.nikname}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

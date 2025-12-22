"use client";
import { init, openTelegramLink } from "@telegram-apps/sdk";
import { useQuery } from "@tanstack/react-query";
import { ReferralResponse } from "@/app/api/referrals/route";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { toast } from "sonner";
import { useTranslation } from "../translations/use_translation";
import { Title } from "@/shared/components/custom_ui/title";
import { RankingCard } from "@/entities/statistics/_ui/RankingCard";
import { getRatingValueLable } from "@/entities/statistics/_vm/get_rating_value_lable";
import { getRatingValue } from "@/entities/statistics/_vm/get_rating_value";

export function ReferralSystem() {
  const { t, language } = useTranslation();
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
    toast.success(t("referrals.copied"));
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <Title text={t("referrals.title")} size="lg" align="center" />
      <p>{t("referrals.description")}</p>
      <div className="flex flex-col space-y-4 ">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {t("referrals.title")}
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {t("referrals.copy_link")}
        </button>
      </div>
      {referrals.data?.data?.referrer?.nikname && (
        <div className="flex gap-2 justify-center  items-center ">
          <h2 className="text-2xl font-bold text-center">{t("referrals.referrer")}</h2>
          <RankingCard
            userId={referrals.data?.data.referrer.userId || ""}
            img={referrals.data?.data.referrer.avatar_url ?? null}
            nickname={referrals.data?.data.referrer.nikname ?? null}
            valueLabel={getRatingValueLable({ metric: "exp", type: "overall", language: language })}
            value={getRatingValue({ metric: "exp", amount: referrals.data?.data.referrer.exp })}
            isFetching={referrals.isFetching}
            lastOnline={referrals.data?.data.referrer.last_online_at}
          />
        </div>
      )}
      {referrals.data?.data.referrals && referrals.data?.data.referrals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">{t("referrals.your_referrals")}</h2>
          <div className="grid grid-cols-3 gap-2 w-full">
            {referrals.data?.data.referrals.length <= 0 && <p>{t("referrals.no_referrals")}</p>}
            {referrals.data?.data.referrals.length > 0 &&
              referrals.data?.data.referrals.map((referral, index) => (
                <RankingCard
                  key={index}
                  userId={referral.userId || ""}
                  img={referral.avatar_url ?? null}
                  nickname={referral.nikname ?? null}
                  valueLabel={getRatingValueLable({ metric: "exp", type: "overall", language: language })}
                  value={getRatingValue({ metric: "exp", amount: referral.exp })}
                  isFetching={referrals.isFetching}
                  lastOnline={referral.last_online_at}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

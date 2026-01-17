export async function checkSubscriptions({ chanel_id, tg_user_id }: { chanel_id: string; tg_user_id: string }) {
  console.log("🔔 checkSubscriptions:", { chanel_id, tg_user_id });
  const resp = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${chanel_id}&user_id=${tg_user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    },
  );
  const resp_json = await resp.json();
  if (!resp.ok || !resp_json) {
    console.error("❌ checkSubscriptions: Telegram API error", resp_json);
    return false;
  }
  const status = resp_json?.result?.status;
  return ["member", "administrator", "creator"].includes(status);
}

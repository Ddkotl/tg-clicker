import TelegramAuth from "@/components/TelegramAuth";

export default async function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center ">
      <TelegramAuth />
    </main>
  );
}

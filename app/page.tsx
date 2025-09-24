import TelegramAuth from "@/components/TelegramAuth";

export default async function Home() {
  return (
    <main className="bg-black w-full h-screen flex items-center justify-center">
      <TelegramAuth />
    </main>
  );
}

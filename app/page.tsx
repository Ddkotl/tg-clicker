import { TelegramAuth } from "@/components/custom_ui/TelegramAuth";

export default async function Home() {
  return (
    <main className="bg-black w-full h-screen flex items-center justify-center">
      <TelegramAuth />
    </main>
  );
}

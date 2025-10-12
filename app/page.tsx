import { TelegramAuth } from "@/entities/auth/_ui/TelegramAuth";

export default async function Home() {
  return (
    <main className="bg-radial-primary w-full h-screen flex items-center justify-center">
      <TelegramAuth />
    </main>
  );
}

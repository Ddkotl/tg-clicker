import TelegramAuth from "@/components/TelegramAuth";

export default async function Home() {
  return (
    <div className="bg-black w-full h-full flex items-center justify-center">
      <TelegramAuth />
    </div>
  );
}

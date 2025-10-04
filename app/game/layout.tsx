import { HeaderStats } from "@/components/custom_ui/HeaderStats";
import NavigationBar from "@/components/custom_ui/NavigationBar";
import { Notifications } from "@/components/custom_ui/Notification";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center ">
      <HeaderStats />
      <div className="max-w-md w-full py-22 px-2 flex flex-col gap-2 justify-start">
        <Notifications />
        {children}
      </div>
      <NavigationBar />
    </main>
  );
}

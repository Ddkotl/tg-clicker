import { HeaderStats } from "@/components/HeaderStats";
import NavigationBar from "@/components/NavigationBar";
import { Notifications } from "@/components/Notification";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full">
      <HeaderStats />
      <div className="py-[82px] px-2 flex flex-col gap-2 justify-start">
        <Notifications />
        {children}
      </div>
      <NavigationBar />
    </div>
  );
}

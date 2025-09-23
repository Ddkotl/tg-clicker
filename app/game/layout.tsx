import { HeaderStats } from "@/components/HeaderStats";
import NavigationBar from "@/components/NavigationBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeaderStats />

      {children}
      <NavigationBar />
    </div>
  );
}

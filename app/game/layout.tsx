import { Notifications } from "@/features/notifications/Notification";
import { Footer } from "@/features/footer/Footer";
import { Header } from "@/features/heeader/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen  text-foreground flex flex-col items-center bg-radial-primary">
      <Header />
      <div className="max-w-md w-full py-22 xs:py-22 px-2 flex flex-col gap-2 justify-start">
        <Notifications />
        {children}
      </div>
      <Footer />
    </main>
  );
}

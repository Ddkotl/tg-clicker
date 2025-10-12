import { Notifications } from "@/shared/components/custom_ui/Notification";
import { Footer } from "@/widgets/footer/Footer";
import { Header } from "@/widgets/heeader/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center ">
      <Header />
      <div className="max-w-md w-full py-22 px-2 flex flex-col gap-2 justify-start">
        <Notifications />
        {children}
      </div>
      <Footer />
    </main>
  );
}

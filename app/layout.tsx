import type { Metadata } from "next";
import { Geist, Nunito } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AppProvider } from "./_providers/app-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Nunito({
  variable: "--font-geist-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qi Wars",
  description: "Qi Wars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark  `}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

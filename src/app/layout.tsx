import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { AnalyticsScripts } from "@/components/common/analytics-scripts";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Wearless — 쇼핑몰 촬영의 새로운 기준",
  description:
    "스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요. 쇼핑몰 셀러를 위한 AI 서비스.",
  icons: {
    icon: [{ url: "/logo.png?v=20260220", type: "image/png" }],
    shortcut: ["/logo.png?v=20260220"],
    apple: [{ url: "/logo.png?v=20260220" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <AnalyticsScripts />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-VJZ6M7M8G6" />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { AnalyticsScripts } from "@/components/common/analytics-scripts";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-VJZ6M7M8G6";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  fallback: [
    "Apple SD Gothic Neo",
    "Malgun Gothic",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body className={`${notoSansKr.variable} antialiased`}>
        <AnalyticsScripts />
        <Header />
        <main className="relative pb-safe-area">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

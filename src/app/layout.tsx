import type { Metadata } from "next";
import { Cal_Sans, Roboto_Mono } from "next/font/google";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { AnalyticsScripts } from "@/components/common/analytics-scripts";
import "./globals.css";

const calSans = Cal_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cal-sans",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const SITE_URL = 'https://www.wearless.kr';

const TITLE = 'Wearless — AI 상세페이지 제작 스튜디오';
const DESCRIPTION =
  '제품 사진만 올리세요. 분석부터 마네킹컷, 콘티, 에디터까지 — AI가 상세페이지를 완성합니다. 쇼핑몰 셀러를 위한 AI 스튜디오.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Wearless',
    images: [
      {
        url: '/og-image.jpg',
        width: 1280,
        height: 720,
        alt: TITLE,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: "/favicon.png?v=20260315-card2", type: "image/png" }],
    shortcut: ["/favicon.png?v=20260315-card2"],
    apple: [{ url: "/favicon.png?v=20260315-card2" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${calSans.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Mark JS-on before paint so reveal animations gate on this; content
            stays visible if JS is disabled or slow. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TGVNWXLW10"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TGVNWXLW10');
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AnalyticsScripts />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

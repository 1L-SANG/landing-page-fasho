import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { AnalyticsScripts } from "@/components/common/analytics-scripts";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const SITE_URL = 'https://www.wearless.kr';

export const metadata: Metadata = {
  title: "Wearless — 쇼핑몰 촬영의 새로운 기준",
  description:
    "스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요. 쇼핑몰 셀러를 위한 AI 서비스.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Wearless — 쇼핑몰 촬영의 새로운 기준',
    description: '스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요. 쇼핑몰 셀러를 위한 AI 서비스.',
    url: SITE_URL,
    siteName: 'Wearless',
    images: [
      {
        url: '/og-image.jpg',
        width: 1280,
        height: 720,
        alt: 'Wearless — 쇼핑몰 촬영의 새로운 기준',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wearless — 쇼핑몰 촬영의 새로운 기준',
    description: '스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요. 쇼핑몰 셀러를 위한 AI 서비스.',
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
    <html lang="ko" suppressHydrationWarning>
      <head>
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
        {/* AuthProvider 가 Header 를 감싸야 한다 — 로그인 버튼이 이 컨텍스트의 openLogin 을
            부르고, 모달도 이 안에서 렌더된다. */}
        <AuthProvider>
          <Header />
          <main className="relative">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

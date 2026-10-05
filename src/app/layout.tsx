import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
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
        url: '/og-image.jpg?v=black-250-medium-20260924',
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
    images: ['/og-image.jpg?v=black-250-medium-20260924'],
  },
  icons: {
    icon: [{ url: "/favicon.png?v=black-250-solid-white-20260924", type: "image/png" }],
    shortcut: ["/favicon.png?v=black-250-solid-white-20260924"],
    apple: [{ url: "/favicon.png?v=black-250-solid-white-20260924" }],
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
        {/* AuthProvider 가 Header 를 감싸야 한다 — 로그인 버튼이 이 컨텍스트의 openLogin 을
            부르고, 모달도 이 안에서 렌더된다. */}
        <AuthProvider>
          {/* 키보드 사용자가 헤더 메뉴를 건너뛰어 본문으로 바로 가게 한다(포커스될 때만 보임). */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-6 focus:z-[60] focus:inline-flex focus:h-10 focus:items-center focus:rounded-full focus:bg-white focus:px-4 focus:text-[15px] focus:leading-none focus:font-semibold focus:text-[#1A1A1A] focus:shadow-[0_12px_32px_rgba(34,42,53,0.14)]"
          >
            본문 바로가기
          </a>
          <Header />
          <main id="main" className="relative">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

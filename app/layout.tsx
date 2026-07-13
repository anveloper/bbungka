import type { Metadata } from "next";
import { Playfair_Display, PT_Serif } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const ptSerif = PT_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bbungka.vercel.app"),
  title: {
    default: "The Bbungka Times — 뻥카뉴스",
    template: "%s — The Bbungka Times",
  },
  description:
    "매일 하나씩, 세상에서 가장 그럴듯한 거짓말. 100% 허구로 지어낸 풍자 신문.",
  keywords: ["뻥카뉴스", "가짜뉴스", "풍자", "패러디 신문", "The Bbungka Times"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Bbungka Times — 뻥카뉴스",
    description: "매일 하나씩, 세상에서 가장 그럴듯한 거짓말.",
    type: "website",
    locale: "ko_KR",
    siteName: "The Bbungka Times",
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
      className={`${playfair.variable} ${ptSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {/* 페인트 전에 테마 적용 → 다크/라이트 깜빡임(FOUC) 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}

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
  title: "The Bbungka Times — 뻥카뉴스",
  description:
    "매일 하나씩, 세상에서 가장 그럴듯한 거짓말. 100% 허구로 지어낸 풍자 신문.",
  openGraph: {
    title: "The Bbungka Times — 뻥카뉴스",
    description: "매일 하나씩, 세상에서 가장 그럴듯한 거짓말.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${ptSerif.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

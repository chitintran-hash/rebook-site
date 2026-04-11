import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rebook.site"),
  title: {
    default: "Re-Book | Sàn Giao Dịch & Trao Đổi Sách Cũ Premium",
    template: "%s | Re-Book"
  },
  description: "Khám phá kho tàng tri thức tại Re-Book. Mua bán, trao đổi sách cũ với tình trạng Like New, Vintage. Tham gia cộng đồng yêu sách ngay hôm nay!",
  keywords: ["sách cũ", "trao đổi sách", "re-book", "mua bán sách", "sách vintage", "book exchange vietnam"],
  authors: [{ name: "Re-Book Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://rebook.site",
    title: "Re-Book | Sàn Trao Đổi Sách Cũ Premium",
    description: "Sàn giao dịch và trao đổi sách cũ lớn nhất Việt Nam. Tiết kiệm hơn, đọc nhiều hơn.",
    siteName: "Re-Book",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Re-Book - Sàn Trao Đổi Sách",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Re-Book | Sàn Trao Đổi Sách Cũ Premium",
    description: "Sàn giao dịch và trao đổi sách cũ lớn nhất Việt Nam.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

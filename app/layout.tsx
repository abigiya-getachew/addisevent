import type { Metadata } from "next";
import { Inter, Noto_Sans_Ethiopic, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic", "latin"],
});

export const metadata: Metadata = {
  title: "Addis Event",
  description: "An event management platform for Addis Ababa, Ethiopia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${notoSansEthiopic.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-cream-ivory">{children}</body>
    </html>
  );
}

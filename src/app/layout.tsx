import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retirement Tax Plan | Optimize Your Withdrawal Strategy",
  description: "Free tax estimation tool for retirees. Compare 2025 vs 2026 tax years and optimize your federal tax liability with income stacking strategies.",
  keywords: ["retirement tax calculator", "income stacking", "tax optimization", "2025 tax brackets", "2026 tax brackets", "withdrawal strategy", "Roth conversion"],
  authors: [{ name: "Christopher Melson", url: "https://financial-independence.melson.us/" }],
  creator: "Christopher Melson",
  openGraph: {
    title: "Retirement Tax Plan | Optimize Your Withdrawal Strategy",
    description: "Estimate your Federal taxes with income stacking optimization. Compare 2025 and 2026 tax scenarios.",
    url: "https://retirement-tax-plan.vercel.app",
    siteName: "Retirement Tax Plan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Tax Plan | Optimize Your Withdrawal Strategy",
    description: "Free tax estimation tool for retirees. Compare 2025 vs 2026 tax years and optimize your federal tax liability.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { Footer } from '@/widgets/layout/ui/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}

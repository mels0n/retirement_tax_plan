import type { Metadata } from "next";
import { generateSoftwareAppSchema } from "@/shared/lib/aeo";
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
  metadataBase: new URL('https://retirement.melson.us'),
  alternates: {
    canonical: '/',
  },
  keywords: ["retirement tax calculator", "income stacking", "tax optimization", "2025 tax brackets", "2026 tax brackets", "withdrawal strategy", "Roth conversion"],
  authors: [{ name: "Christopher Melson", url: "https://chris.melson.us/" }],
  creator: "Christopher Melson",
  openGraph: {
    title: "Retirement Tax Plan | Optimize Your Withdrawal Strategy",
    description: "Estimate your Federal taxes with income stacking optimization. Compare 2025 and 2026 tax scenarios.",
    url: "https://retirement.melson.us",
    siteName: "Retirement Tax Plan",
    locale: "en_US",
    type: "website",
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Retirement Tax Plan Preview',
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Tax Plan | Optimize Your Withdrawal Strategy",
    description: "Free tax estimation tool for retirees. Compare 2025 vs 2026 tax years and optimize your federal tax liability.",
    images: ['/twitter-image.png'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateSoftwareAppSchema(
                "Retirement Tax Plan",
                "https://retirement.melson.us",
                "https://retirement.melson.us/og-image.png",
                "Free tax estimation tool for retirees. Compare 2025 vs 2026 tax years and optimize your federal tax liability with income stacking strategies.",
                "Christopher Melson",
                "https://chris.melson.us/",
                "FinanceApplication",
                "Web",
                "Free"
              )
            )
          }}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}

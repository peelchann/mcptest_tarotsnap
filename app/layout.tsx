import type { Metadata } from "next";
import "./globals.css";
import StarsBackground, { StarsFallback } from "./components/StarsBackground";
import ScrollingSymbols from "./components/ScrollingSymbols";
import { AuthProvider } from "./providers/AuthProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
  description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom.",
  keywords: "tarot, AI tarot, tarot reading, spiritual guidance, divination, mystical, oracle",
  authors: [{ name: "TarotSnap" }],
  openGraph: {
    title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
    description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom.",
    type: "website",
    images: [
      {
        url: "/tarot-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TarotSnap - AI Tarot Readings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
    description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom.",
    images: ["/tarot-og-image.jpg"],
  },
  robots: "index, follow",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Simplified Web Vitals - will be handled by analytics.ts instead

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-gradient-to-b from-agatha-navy to-agatha-mid text-agatha-mist font-body min-h-screen" suppressHydrationWarning>
        {/* Static fallback stars that show immediately during initial load */}
        <StarsFallback />
        
        {/* Dynamic canvas-based stars that replace the fallback once loaded */}
        <StarsBackground />
        
        {/* Decorative scrolling witch symbols */}
        <ScrollingSymbols />
        
        {/* Content */}
        <AuthProvider>
          <main className="relative z-10 min-h-screen container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
        
        {/* Google Analytics 4 - Only in production */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}

// Prevent error toasts from appearing
export function reportWebVitals(): void {
  // Silence is golden - intentionally not reporting to disable dev toasts
}

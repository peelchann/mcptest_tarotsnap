import type { Metadata } from "next";
import "./globals.css";
import StarsBackground, { StarsFallback } from "./components/StarsBackground";
import { AuthProvider } from "./providers/AuthProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import StructuredData from "./components/StructuredData";

const canonicalBaseUrl = process.env.NODE_ENV === 'production'
  ? 'https://tarot-snap.vercel.app'
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(canonicalBaseUrl),
  title: {
    template: '%s | TarotSnap',
    default: 'TarotSnap - AI Tarot Readings & Spiritual Guidance',
  },
  description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom powered by advanced AI technology.",
  keywords: [
    "tarot", "AI tarot", "tarot reading", "spiritual guidance", "divination", 
    "mystical", "oracle", "free tarot reading", "online tarot", "tarot cards",
    "spiritual advisor", "fortune telling", "tarot card meanings", "psychic reading"
  ],
  authors: [{ name: "TarotSnap", url: "https://tarotsnap.com" }],
  creator: "TarotSnap",
  publisher: "TarotSnap",
  category: "Spirituality",
  classification: "Tarot and Spiritual Guidance",
  openGraph: {
    title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
    description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom.",
    type: "website",
    locale: "en_US",
    siteName: "TarotSnap",
    images: [
      {
        url: "/tarot-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
    description: "Get personalized AI tarot readings with mystical guidance. Ancient wisdom meets modern AI technology.",
    images: ["/tarot-og-image.jpg"],
    creator: "@tarotsnap",
    site: "@tarotsnap",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'JDomEglmiJxAajLXTE4frGcLjRoIGFDsVIW2hrznc8g', // Google Search Console verification
  },
  alternates: {
    canonical: canonicalBaseUrl,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1a1a2e' },
    ],
  },
  manifest: '/site.webmanifest',
  applicationName: 'TarotSnap',
  appleWebApp: {
    capable: true,
    title: 'TarotSnap',
    statusBarStyle: 'black-translucent',
  },
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
        {/* iOS Safari specific meta tags to prevent system color overrides */}
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#4c1d95" />
        <meta name="msapplication-navbutton-color" content="#4c1d95" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-gradient-to-b from-agatha-navy to-agatha-mid text-agatha-mist font-body min-h-screen" suppressHydrationWarning>
        {/* SEO Structured Data */}
        <StructuredData type="homepage" />
        
        {/* Static fallback stars that show immediately during initial load */}
        <StarsFallback />
        
        {/* Dynamic canvas-based stars that replace the fallback once loaded */}
        <StarsBackground />
        
        {/* Content */}
        <AuthProvider>
          <main className="relative z-10 min-h-screen">
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

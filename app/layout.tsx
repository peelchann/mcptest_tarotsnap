import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import StructuredData from "./components/StructuredData";
import AmbientBackground from "./components/coven/AmbientBackground";
import SiteHeader from "./components/coven/SiteHeader";

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

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
    google: 'JDomEglmiJxAajLXTE4frGcLjRoIGFDsVIW2hrznc8g',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0B0810" />
        <meta name="msapplication-navbutton-color" content="#0B0810" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className="coven-body antialiased font-sans bg-coven-deep text-coven-bone min-h-screen"
        suppressHydrationWarning
      >
        <StructuredData type="homepage" />

        <AmbientBackground />
        <div className="grain" aria-hidden="true" />

        <AuthProvider>
          <SiteHeader />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </AuthProvider>

        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}

export function reportWebVitals(): void {
  // Silence is golden - intentionally not reporting to disable dev toasts
}

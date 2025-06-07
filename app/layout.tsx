import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StarsBackground, { StarsFallback } from "./components/StarsBackground";
import ScrollingSymbols from "./components/ScrollingSymbols";
import { AuthProvider } from "./providers/AuthProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
  description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom.",
  keywords: "tarot, AI tarot, tarot reading, spiritual guidance, divination, mystical, oracle",
  authors: [{ name: "TarotSnap" }],
  openGraph: {
    title: "TarotSnap - AI Tarot Readings & Spiritual Guidance",
    description: "Get personalized AI tarot readings with mystical guidance. Ask the universe your questions and receive insights through ancient tarot wisdom.",
    type: "website",
    url: "https://tarotsnap.com",
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
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

// Web Vitals Component for Performance Monitoring
function WebVitals() {
  if (typeof window === 'undefined') return null;
  
  // Dynamically import to avoid SSR issues
  import('next/web-vitals').then(({ useReportWebVitals }) => {
    if (typeof useReportWebVitals === 'function') {
      useReportWebVitals((metric) => {
        // Send to Google Analytics
        if (window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
        
        // Log for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Web Vital:', metric);
        }
      });
    }
  });
  
  return null;
}

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
        <WebVitals />
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

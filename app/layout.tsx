import type { Metadata } from "next";
import "./globals.css";
import StarsBackground, { StarsFallback } from "./components/StarsBackground";
import ScrollingSymbols from "./components/ScrollingSymbols";

export const metadata: Metadata = {
  title: "TarotSnap",
  description: "Peer into the shadows of fate with dark magic divination",
};

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
        <main className="relative z-10 min-h-screen container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}

// Prevent error toasts from appearing
export function reportWebVitals(): void {
  // Silence is golden - intentionally not reporting to disable dev toasts
}

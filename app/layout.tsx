import type { Metadata } from "next";
import "./globals.css";
import StarsBackground from "./components/StarsBackground";
import ScrollingSymbols from "./components/ScrollingSymbols";

export const metadata: Metadata = {
  title: "TarotSnap - Mystical Tarot Reading",
  description: "Interactive tarot card readings with AI analysis and mystical insights",
  keywords: "tarot, mystical, cards, reading, fortune, divination, AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-body text-mystical-light bg-mystical-dark">
        {/* Background elements */}
        <StarsBackground />
        
        {/* Decorative scrolling borders */}
        <ScrollingSymbols position="top" />
        <ScrollingSymbols position="bottom" reverse={true} />
        <ScrollingSymbols position="left" speed="slow" />
        <ScrollingSymbols position="right" speed="slow" reverse={true} />
        
        {/* Main content */}
        <main className="relative z-10 min-h-screen mx-8 my-8">
          {children}
        </main>
      </body>
    </html>
  );
}

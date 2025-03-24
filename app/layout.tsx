import type { Metadata } from "next";
import "./globals.css";
import StarsBackground from "./components/StarsBackground";
import ScrollingSymbols from "./components/ScrollingSymbols";

export const metadata: Metadata = {
  title: "TarotSnap - Agatha's Mystical Tarot",
  description: "Interactive tarot card readings with witchcraft-inspired visuals and mystical insights",
  keywords: "tarot, witchcraft, agatha harkness, mystical, divination, magic, purple, witch",
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
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-agatha-deeper text-agatha-mist font-body">
        {/* Background elements */}
        <StarsBackground />
        
        {/* Decorative witchcraft runes and symbols around the edges */}
        <ScrollingSymbols position="top" reverse speed="slow" />
        <ScrollingSymbols position="right" speed="slow" />
        <ScrollingSymbols position="bottom" speed="slow" />
        <ScrollingSymbols position="left" reverse speed="slow" />
        
        {/* Purple mist overlay */}
        <div className="fixed inset-0 bg-agatha-purple/5 z-1 pointer-events-none"></div>
        
        {/* Magic circle in the background */}
        <div className="fixed inset-0 flex items-center justify-center z-1 pointer-events-none opacity-20">
          <div className="w-[80vmin] h-[80vmin] rounded-full border border-agatha-rune/30 animate-spell-cast"></div>
          <div className="absolute w-[60vmin] h-[60vmin] rounded-full border border-agatha-rune/20 animate-witchcraft"></div>
        </div>
        
        {/* Content */}
        <main className="relative z-10 min-h-screen container mx-auto px-4 py-8">
          {children}
        </main>
        
        {/* Footer rune */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 font-witchcraft text-2xl text-agatha-rune/40 animate-magic-text z-10">
          ⍟
        </div>
      </body>
    </html>
  );
}

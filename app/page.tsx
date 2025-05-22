'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TarotCarousel } from './components/TarotCarousel';
import { cards } from './data/cards';
import Image from 'next/image';
import SpreadCard from './components/SpreadCard';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Find specific cards for display, default to first card if not found or no imagePath
  const singleCardImage = cards.find(card => card.id === 'the-fool')?.imagePath || cards[0]?.imagePath || '/images/tarot/default.png';
  const threeCardImage = cards.find(card => card.id === 'judgement')?.imagePath || cards[1]?.imagePath || '/images/tarot/default.png';
  const witchCrossImage = cards.find(card => card.id === 'the-world')?.imagePath || cards[2]?.imagePath || '/images/tarot/default.png';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with animated witchcraft title */}
      <header className={`
        transition-all duration-1000
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
        text-center pt-12 pb-6 max-w-2xl mx-auto
      `}>
        <h1 className="font-witchcraft text-5xl md:text-5xl mb-3 text-gold-400 leading-tight drop-shadow-light-text animate-magic-text text-[3rem]">
          TarotSnap
        </h1>
        <p className="font-mystical text-base md:text-lg mb-4 max-w-md mx-auto text-agatha-light leading-normal text-[1.25rem]">
          Peer into the shadows of fate with dark magic divination
        </p>
        <div className="flex justify-center space-x-4 my-3">
          <div className="h-0.5 w-20 md:w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
          <div className="text-gold-400 animate-magic-pulse text-xl">âœ§</div>
          <div className="h-0.5 w-20 md:w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
        </div>
      </header>

      {/* 3-Card Spread Panel */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <SpreadCard 
            title="Single Card Draw"
            description="Pull a single card for quick insight or daily guidance. Simple, direct, and illuminating."
            buttonText="Draw a Card"
            linkHref="/reading/single"
            imageSrc={singleCardImage}
            imageAlt="Single Tarot Card Spread"
          />
          <SpreadCard 
            title="Three Card Spread"
            description="Explore past, present, and future influences, or gain clarity on a specific situation with three interconnected cards."
            buttonText="Begin Reading"
            linkHref="/reading/three-card"
            imageSrc={threeCardImage}
            imageAlt="Three Card Tarot Spread"
          />
          <SpreadCard 
            title="Witch's Cross Spread"
            description="Delve deeper with the Witch's Cross, a comprehensive spread for uncovering complex dynamics and hidden truths."
            buttonText="Deep Dive"
            linkHref="/reading/witch-cross"
            imageSrc={witchCrossImage}
            imageAlt="Witch's Cross Tarot Spread"
          />
        </div>
      </main>
      
      {/* Call to action with witchcraft theme */}
      <section className={`
        container mx-auto px-4 mb-12
        transition-all duration-1000 delay-700
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
        <div className="
          bg-agatha-deeper/70 backdrop-blur-md 
          border border-agatha-rune/30 
          rounded-lg p-8 max-w-2xl mx-auto 
          shadow-lg relative overflow-hidden
        ">
          {/* Decorative runes */}
          <div className="absolute top-3 left-3 text-agatha-rune/20 font-witchcraft text-xl">ᛏ</div>
          <div className="absolute bottom-3 right-3 text-agatha-rune/20 font-witchcraft text-xl">ᛦ</div>
          <div className="absolute top-3 right-3 text-agatha-rune/20 font-witchcraft text-xl">ᚾ</div>
          <div className="absolute bottom-3 left-3 text-agatha-rune/20 font-witchcraft text-xl">ᛉ</div>
          
          {/* Purple glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-agatha-purple/5 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="font-witchcraft text-3xl mb-2 text-agatha-light text-center leading-tight">Unveil Your Destiny</h2>
            <div className="h-0.5 w-24 mx-auto bg-agatha-accent/60 mb-4"></div>
            
            <p className="mb-6 text-agatha-light font-mystical text-center text-base leading-relaxed">
              Let Agatha's dark arts guide your path and reveal the threads of fate that bind your past, 
              present, and future. Tap into ancient witchcraft to illuminate what remains hidden.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about" className="
                py-3 px-6 rounded-xl
                bg-agatha-mid text-gold-400 font-semibold
                border border-gold-400
                transition-all duration-300
                hover:bg-gold-500 hover:text-[#1E1E3F]
                focus:ring-2 focus:ring-gold-500 focus:outline-none
                font-mystical
              ">
                About the Craft
              </Link>
              <Link href="/reading" className="
                py-3 px-6 rounded-xl
                bg-gold-400 text-[#1E1E3F] font-semibold
                border border-gold-400
                transition-all duration-300
                hover:bg-gold-500
                focus:ring-2 focus:ring-gold-500 focus:outline-none
                font-mystical
              ">
                Begin Divination
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer with witchcraft symbols */}
      <footer className={`
        mt-auto py-6 text-sm text-agatha-light text-center border-t border-agatha-purple/20
        transition-all duration-1000 delay-900
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-agatha-rune/60">⚝</span>
          <p>TarotSnap © {new Date().getFullYear()}</p>
          <span className="text-agatha-rune/60">⚝</span>
        </div>
        <p className="font-witchcraft mt-1 text-xs text-agatha-rune/80">The power of divination in your hands</p>
      </footer>
    </div>
  );
}

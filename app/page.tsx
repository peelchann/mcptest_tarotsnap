'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TarotCarousel } from './components/TarotCarousel';
import { cards } from './data/cards';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with animated witchcraft title */}
      <header className={`
        transition-all duration-1000 
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
        text-center pt-12 pb-6
      `}>
        <h1 className="font-witchcraft text-5xl md:text-6xl mb-2 text-agatha-vibrant animate-magic-text">
          <span className="relative inline-block">
            Agatha's
            <span className="absolute -top-6 -right-6 text-3xl text-agatha-accent animate-witch-finger">✦</span>
          </span>{" "}
          <span className="text-agatha-vibrant">Tarot</span>
          <span className="text-agatha-accent">Snap</span>
        </h1>
        <p className="font-mystical text-xl mb-3 max-w-md mx-auto text-agatha-mist">
          Peer into the shadows of fate with dark magic divination
        </p>
        <div className="flex justify-center space-x-4 my-3">
          <div className="h-0.5 w-20 md:w-32 bg-gradient-to-r from-transparent via-agatha-purple to-transparent"></div>
          <div className="text-agatha-rune animate-magic-pulse text-xl">✧</div>
          <div className="h-0.5 w-20 md:w-32 bg-gradient-to-r from-transparent via-agatha-purple to-transparent"></div>
        </div>
      </header>

      {/* Interactive card carousel */}
      <section className={`
        w-full mx-auto mb-12
        transition-all duration-1000 delay-300 
        ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        <TarotCarousel cards={cards.slice(0, 5)} />
      </section>

      {/* Reading options in a nice grid */}
      <section className="bg-agatha-deeper/50 backdrop-blur-sm py-14 my-8">
        <div className="container mx-auto px-4">
          <h2 className="font-witchcraft text-2xl text-center text-agatha-vibrant mb-10 animate-magic-text">
            Uncover the Mysteries of Your Destiny
          </h2>
          
          <div className={`
            grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto
            transition-all duration-1000 delay-500
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
            {/* Single Card Reading */}
            <div className="bg-agatha-dark/80 backdrop-blur-sm border border-agatha-purple/30 rounded-lg p-6 transform transition-all duration-500 hover:shadow-agatha-glow hover:scale-105">
              <div className="relative">
                <div className="font-witchcraft text-xl mb-1 text-agatha-vibrant">Single Card</div>
                <div className="absolute -top-2 -right-2 text-agatha-rune/40 font-witchcraft text-sm animate-magic-pulse">✧</div>
              </div>
              <div className="h-0.5 w-16 mx-auto bg-agatha-purple/40 mb-4"></div>
              <p className="text-agatha-mist/90 text-sm mb-6 font-mystical">
                A quick glimpse into your immediate destiny
              </p>
              
              <div className="flex justify-center items-center mb-5 opacity-90">
                <div className="w-16 h-24 bg-agatha-darker rounded-md border border-agatha-accent/20 transform rotate-6 shadow-agatha-glow/30 absolute"></div>
                <div className="w-16 h-24 bg-agatha-deeper rounded-md border border-agatha-accent/30 transform -rotate-6 relative"></div>
              </div>
              
              <Link href="/reading/single" className="
                block w-full text-center py-2 px-4 rounded
                bg-gradient-to-r from-agatha-purple/80 to-agatha-deeper/80
                text-agatha-mist hover:text-white 
                border border-agatha-accent/20
                transition-all duration-300
                hover:shadow-agatha-glow hover:border-agatha-accent/50
                font-mystical
              ">
                Draw a Card
              </Link>
            </div>
            
            {/* Three Card Reading */}
            <div className="bg-agatha-dark/80 backdrop-blur-sm border border-agatha-purple/30 rounded-lg p-6 transform transition-all duration-500 hover:shadow-agatha-glow hover:scale-105">
              <div className="relative">
                <div className="font-witchcraft text-xl mb-1 text-agatha-vibrant">Three Cards</div>
                <div className="absolute -top-2 -right-2 text-agatha-rune/40 font-witchcraft text-sm animate-magic-pulse">✦</div>
              </div>
              <div className="h-0.5 w-16 mx-auto bg-agatha-purple/40 mb-4"></div>
              <p className="text-agatha-mist/90 text-sm mb-6 font-mystical">
                Past whispers, present forces, future shadows
              </p>
              
              <div className="flex justify-center items-center mb-5 opacity-90">
                <div className="w-12 h-20 bg-agatha-deeper rounded-md border border-agatha-accent/20 transform -rotate-12 -translate-x-8 absolute"></div>
                <div className="w-12 h-20 bg-agatha-darker rounded-md border border-agatha-accent/40 transform translate-z-0 relative"></div>
                <div className="w-12 h-20 bg-agatha-deeper rounded-md border border-agatha-accent/20 transform rotate-12 translate-x-8 absolute"></div>
              </div>
              
              <Link href="/reading/three" className="
                block w-full text-center py-2 px-4 rounded
                bg-gradient-to-r from-agatha-purple/80 to-agatha-deeper/80
                text-agatha-mist hover:text-white 
                border border-agatha-accent/20
                transition-all duration-300
                hover:shadow-agatha-glow hover:border-agatha-accent/50
                font-mystical
              ">
                Begin Reading
              </Link>
            </div>
            
            {/* Celtic Cross */}
            <div className="bg-agatha-dark/80 backdrop-blur-sm border border-agatha-purple/30 rounded-lg p-6 transform transition-all duration-500 hover:shadow-agatha-glow hover:scale-105">
              <div className="relative">
                <div className="font-witchcraft text-xl mb-1 text-agatha-vibrant">Witch's Cross</div>
                <div className="absolute -top-2 -right-2 text-agatha-rune/40 font-witchcraft text-sm animate-magic-pulse">ᛏ</div>
              </div>
              <div className="h-0.5 w-16 mx-auto bg-agatha-purple/40 mb-4"></div>
              <p className="text-agatha-mist/90 text-sm mb-6 font-mystical">
                Dark divination revealing all paths of fate
              </p>
              
              <div className="flex justify-center items-center mb-5 opacity-80">
                <div className="relative w-24 h-24">
                  <div className="w-10 h-16 bg-agatha-deeper rounded-md border border-agatha-accent/30 absolute top-4 left-1"></div>
                  <div className="w-10 h-16 bg-agatha-darker rounded-md border border-agatha-accent/20 absolute top-4 right-1"></div>
                  <div className="w-16 h-10 bg-agatha-deeper rounded-md border border-agatha-accent/30 absolute left-4 top-1"></div>
                  <div className="w-16 h-10 bg-agatha-darker rounded-md border border-agatha-accent/20 absolute left-4 bottom-1"></div>
                </div>
              </div>
              
              <Link href="/reading/celtic" className="
                block w-full text-center py-2 px-4 rounded
                bg-gradient-to-r from-agatha-purple/80 to-agatha-deeper/80
                text-agatha-mist hover:text-white 
                border border-agatha-accent/20
                transition-all duration-300
                hover:shadow-agatha-glow hover:border-agatha-accent/50
                font-mystical
              ">
                Deep Dive
              </Link>
            </div>
          </div>
        </div>
      </section>
      
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
            <h2 className="font-witchcraft text-2xl mb-2 text-agatha-vibrant text-center">Unveil Your Destiny</h2>
            <div className="h-0.5 w-24 mx-auto bg-agatha-purple/40 mb-4"></div>
            
            <p className="mb-6 text-agatha-mist font-mystical text-center">
              Let Agatha's dark arts guide your path and reveal the threads of fate that bind your past, 
              present, and future. Tap into ancient witchcraft to illuminate what remains hidden.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about" className="
                py-2 px-6 rounded
                bg-agatha-deeper 
                text-agatha-mist hover:text-agatha-accent 
                border border-agatha-purple/30
                transition-all duration-300
                hover:shadow-agatha-glow hover:border-agatha-purple/50
                font-mystical
              ">
                About the Craft
              </Link>
              <Link href="/reading" className="
                py-2 px-6 rounded
                bg-gradient-to-r from-agatha-purple/80 to-agatha-deeper
                text-agatha-mist hover:text-white 
                border border-agatha-accent/30
                transition-all duration-300
                hover:shadow-agatha-glow hover:border-agatha-accent/60
                font-mystical
                animate-magic-pulse
              ">
                Begin Divination
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer with witchcraft symbols */}
      <footer className={`
        mt-auto py-6 text-sm text-agatha-mist/60 text-center border-t border-agatha-purple/20
        transition-all duration-1000 delay-900
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-agatha-rune/40">⚝</span>
          <p>TarotSnap © {new Date().getFullYear()}</p>
          <span className="text-agatha-rune/40">⚝</span>
        </div>
        <p className="font-witchcraft mt-1 text-xs text-agatha-rune/40">The power of divination in your hands</p>
      </footer>
    </div>
  );
}

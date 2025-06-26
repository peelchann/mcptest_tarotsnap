"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { MysticalHeader } from "@/app/components/MysticalHeader"
import { getRandomCards, type TarotCard as TarotCardType } from "@/app/data/cards"
import { ArtisticDeck } from "@/app/components/ArtisticDeck"

function TarotSnapHomepage() {
  // Random tarot cards state with Context7 optimized initialization
  const [randomCards, setRandomCards] = useState<TarotCardType[]>(() => getRandomCards(3))
  const [isLoaded, setIsLoaded] = useState(false)

  // Client-side randomization to prevent SSR hydration mismatch (Context7 best practice)
  useEffect(() => {
    setRandomCards(getRandomCards(3))
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden">
      {/* Mystical Authentication Header */}
      <MysticalHeader />

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-6 lg:px-10 2xl:px-0 py-6 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[40%_auto] gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 min-h-[calc(100vh-120px)] items-center max-w-7xl mx-auto">
            
            {/* Left Side - Content */}
            <div className="space-y-6 lg:space-y-12 text-center lg:text-left order-1 lg:order-1 max-w-none">
              {/* Main Heading */}
              <div className="space-y-3 lg:space-y-6">
                <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 leading-tight tracking-tight max-w-none">
                  TarotSnap
                </h1>
                
                <h2 className="text-[clamp(1.25rem,4vw,2rem)] text-slate-300 font-light leading-relaxed max-w-none">
                  Your AI Mystic That{" "}
                  <span className="text-amber-300 font-semibold block lg:inline">
                    Evolves With You
                  </span>
                </h2>
              </div>

              {/* Simple Value Proposition */}
              <p className="text-[clamp(1rem,3vw,1.5rem)] text-slate-400 leading-relaxed max-w-prose font-light">
                Get instant readings that remember your journey
              </p>

              {/* CTA Button */}
              <div className="pt-4 lg:pt-8">
                <Link href="/reading/single">
                  <button className="group relative px-8 lg:px-12 py-4 lg:py-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 rounded-full text-slate-900 font-bold text-[clamp(1rem,2.5vw,1.25rem)] shadow-2xl shadow-amber-500/25 hover:scale-105 transition-transform">
                    <span className="relative z-10 flex items-center gap-3 justify-center">
                      <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                      <span>Start Your Journey</span>
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Artistic Tarot Deck */}
            <div className="relative flex items-center justify-center lg:justify-end order-2 lg:order-2 min-h-[500px] lg:min-h-[600px]">
              <ArtisticDeck 
                cards={randomCards}
                className="w-full max-w-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Mystical Quote */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 text-center text-amber-400/60 px-4">
          <div className="text-sm md:text-base font-light tracking-wider">
            ✨ "The cards reveal what the soul already knows" ✨
          </div>
        </div>
      </div>
    </div>
  )
}

export default TarotSnapHomepage

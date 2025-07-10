'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TarotCard from './TarotCard';
import type { TarotCard as TarotCardType } from '@/app/data/cards';

interface ArtisticDeckProps {
  cards: TarotCardType[];
  className?: string;
}

// Professional floating animation variants
const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror" as const
    }
  }
};

// Staggered float for visual variety
const createStaggeredFloat = (delay: number) => ({
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror" as const,
      delay
    }
  }
});

export const ArtisticDeck: React.FC<ArtisticDeckProps> = ({ 
  cards, 
  className = '' 
}) => {
  const prefersReducedMotion = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // SSR-safe mount detection
  const [isMounted, setIsMounted] = useState(false);
  
  // Allow only first three cards
  const trio = cards.slice(0, 3);
  
  // Simple mount detection for SSR compatibility
  useEffect(() => {
    setIsMounted(true);
    
    // CSS fallback for maximum reliability
    const timer = setTimeout(() => {
      cardRefs.current.forEach((card) => {
        if (card) {
          card.classList.add('hero-card-visible');
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-center lg:justify-end",
        "order-2 lg:order-2",
        className
      )}
    >
      {/* Desktop Layout - Clean fixed layout with floating animations */}
      <div className="hidden md:flex gap-8">
        {trio.map((card, i) => {
          // Create unique floating animations for each card
          const floatVariant = i === 1 
            ? floatVariants // Main card gets primary float
            : createStaggeredFloat(i * 0.8); // Side cards get staggered float

          return (
            <motion.div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={cn(
                "relative w-44 aspect-[3/5] rounded-lg shrink-0",
                "focus:outline-none focus:ring-4 focus:ring-amber-400/40",
                "hero-card-fallback", // CSS fallback class
                "transition-transform duration-150",
                // Subtle rotations for desktop
                i === 0 && "-rotate-3",
                i === 2 && "rotate-3"
              )}
              style={{
                zIndex: i === 1 ? 10 : 1, // Middle card on top
              }}
              initial={{ opacity: 0, y: 32, scale: 0.9 }}
              animate={isMounted ? { 
                opacity: 1, 
                y: i === 1 ? 0 : 24, // Tiered positioning: middle high, sides lower
                scale: 1
              } : { opacity: 0, y: 32, scale: 0.9 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.2 : 0.6,
                delay: prefersReducedMotion ? 0 : i * 0.15, // Stagger: 0, 0.15, 0.3
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{
                scale: 1.05,
                rotateX: 2,
                rotateY: -4,
                y: i === 1 ? -8 : 16, // Lift based on original position + slight lift
                transition: { 
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.15 }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${card.name} tarot card`}
            >
              {/* Floating container with GPU-friendly transforms */}
              <motion.div
                className="w-full h-full"
                variants={prefersReducedMotion ? undefined : floatVariant}
                initial={prefersReducedMotion ? undefined : "initial"}
                animate={prefersReducedMotion ? undefined : "animate"}
              >
                {/* Card container with proper aspect ratio */}
                <div className="w-full h-full relative">
                  <TarotCard
                    card={card}
                    isReversed={card.isReversed}
                    isFlipped={true}
                    className="w-full h-full"
                    onClick={() => {
                      console.log(`Selected card: ${card.name}`);
                    }}
                  />

                  {/* Desktop caption */}
                  <figcaption
                    className={cn(
                      "absolute -bottom-12 left-1/2 -translate-x-1/2",
                      "text-center w-full max-w-[176px]", // Match card width
                      "bg-slate-900/95 text-slate-100 backdrop-blur-sm",
                      "rounded-lg px-3 py-2 shadow-lg"
                    )}
                  >
                    <p className="text-amber-300 font-semibold text-sm leading-tight">
                      {card.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {card.keywords.slice(0, 2).join(' • ')}
                    </p>
                  </figcaption>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Layout - Lightweight swipe row (no floating for performance) */}
      <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
        {trio.map((card, i) => {
          return (
            <motion.div
              key={`mobile-${card.id}`}
              ref={(el) => { if (!cardRefs.current[i]) cardRefs.current[i] = el; }}
              className={cn(
                "w-40 aspect-[3/5] shrink-0 snap-center rounded-lg",
                "focus:outline-none focus:ring-4 focus:ring-amber-400/40",
                "hero-card-fallback" // CSS fallback class
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isMounted ? { 
                opacity: 1, 
                scale: 1
              } : { opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.2 : 0.5,
                delay: prefersReducedMotion ? 0 : i * 0.1
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${card.name} tarot card`}
            >
              {/* Card container - no floating on mobile for performance */}
              <div className="w-full h-full relative">
                <TarotCard
                  card={card}
                  isReversed={card.isReversed}
                  isFlipped={true}
                  className="w-full h-full"
                  onClick={() => {
                    console.log(`Selected card: ${card.name}`);
                  }}
                />

                {/* Mobile caption */}
                <figcaption
                  className={cn(
                    "absolute -bottom-10 left-1/2 -translate-x-1/2",
                    "text-center w-full max-w-[160px]",
                    "bg-slate-900/95 text-slate-100 backdrop-blur-sm",
                    "rounded-lg px-2 py-1 shadow-lg"
                  )}
                >
                  <p className="text-amber-300 font-semibold text-xs leading-tight">
                    {card.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {card.keywords.slice(0, 2).join(' • ')}
                  </p>
                </figcaption>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}; 
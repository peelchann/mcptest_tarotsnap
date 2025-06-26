'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TarotCard from './TarotCard';
import type { TarotCard as TarotCardType } from '@/app/data/cards';

interface ArtisticDeckProps {
  cards: TarotCardType[];
  className?: string;
}

export const ArtisticDeck: React.FC<ArtisticDeckProps> = ({ 
  cards, 
  className = '' 
}) => {
  const prefersReducedMotion = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Allow only first three cards
  const trio = cards.slice(0, 3);
  
  // Simple rotation values for mystical effect (no complex positioning)
  const rotations = [-4, 0, 6] as const;

  // Failsafe: Ensure cards are visible after 2 seconds if animations fail
  useEffect(() => {
    const timer = setTimeout(() => {
      cardRefs.current.forEach((card) => {
        if (card) {
          card.classList.add('hero-card-visible');
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex justify-center md:justify-end",
        // Mobile: horizontal scroll with snap
        "overflow-x-auto md:overflow-x-visible",
        "snap-x snap-mandatory md:snap-none",
        "pb-4 md:pb-0", // padding for mobile scrollbar
        className
      )}
    >
      <div className="flex items-start gap-4 md:gap-0">
        {trio.map((card, i) => {
          return (
            <motion.div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={cn(
                "relative shrink-0",
                // Fixed aspect ratio container to prevent caption overflow
                "w-[200px] md:w-[220px] aspect-[3/5]",
                // Simple overlap on desktop using negative margins
                i > 0 && "md:-ml-8",
                // Mobile: snap scroll behavior
                "snap-center md:snap-align-none",
                // Focus glow effect for accessibility
                "focus:outline-none focus:ring-4 focus:ring-amber-400/40 rounded-lg",
                // CSS fallback class
                "hero-card-fallback"
              )}
              style={{
                // Simple rotation only - no complex transforms
                transform: `rotate(${rotations[i]}deg)`,
                // Proper z-index for overlap
                zIndex: trio.length - i,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              transition={{ 
                delay: prefersReducedMotion ? 0 : i * 0.1, // Respect motion preferences
                duration: prefersReducedMotion ? 0.2 : 0.6,
                ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing
              }}
              whileHover={{
                scale: 1.08,
                rotateX: 8,
                rotateY: 12,
                z: 20,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.15 }
              }}
              tabIndex={0} // Make focusable for accessibility
              role="button"
              aria-label={`View ${card.name} tarot card`}
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

                {/* Improved caption with responsive sizing */}
                <figcaption
                  className={cn(
                    "absolute -bottom-12 left-1/2 -translate-x-1/2",
                    "text-center w-full max-w-[160px]", // Responsive width instead of character limit
                    "bg-slate-900/90 text-slate-100 backdrop-blur-sm",
                    "rounded-lg px-3 py-2"
                  )}
                >
                  <p className="text-amber-300 font-semibold text-sm md:text-base truncate">
                    {card.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 truncate">
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
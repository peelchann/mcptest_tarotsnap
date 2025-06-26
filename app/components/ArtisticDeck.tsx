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
  
  // Tiered positioning: side cards lower, middle card on top
  const cardPositions = [
    { yPos: 16, rotation: 'md:-rotate-3', zIndex: 1 }, // Left card
    { yPos: 0, rotation: '', zIndex: 10 },             // Middle card (on top)
    { yPos: 16, rotation: 'md:rotate-3', zIndex: 1 }   // Right card
  ] as const;

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
        "flex items-center justify-center lg:justify-end",
        "order-2 lg:order-2 min-h-[420px]",
        className
      )}
    >
      {/* Refined flex layout with proper gaps and responsive behavior */}
      <div className={cn(
        "flex md:gap-8 gap-4",
        "md:flex-row flex-nowrap overflow-x-auto snap-x md:snap-none",
        "pb-4 md:pb-0" // padding for mobile scrollbar
      )}>
        {trio.map((card, i) => {
          const position = cardPositions[i];
          
          return (
            <motion.div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={cn(
                "shrink-0 w-44 md:w-56 aspect-[3/5]",
                position.rotation, // Subtle rotation on desktop only
                "focus:outline-none focus:ring-4 focus:ring-amber-400/40",
                "rounded-lg snap-center",
                "hero-card-fallback", // CSS fallback class
                "hover:-translate-y-1 transition-transform duration-150" // Subtle lift on hover
              )}
              style={{
                zIndex: position.zIndex,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ 
                opacity: 1, 
                y: position.yPos, // Tiered positioning
                scale: 1
              }}
              transition={{ 
                duration: prefersReducedMotion ? 0.2 : 0.6,
                delay: prefersReducedMotion ? 0 : (i + 1) * 0.1, // Stagger: 0.1, 0.2, 0.3
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{
                scale: 1.05,
                rotateX: 5,
                rotateY: 8,
                y: position.yPos - 4, // Lift slightly higher
                transition: { 
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.15 }
              }}
              viewport={{ 
                once: true, 
                amount: 0.3,
                margin: "0px 0px -50px 0px"
              }}
              tabIndex={0}
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

                {/* Refined caption with better responsive sizing */}
                <figcaption
                  className={cn(
                    "absolute -bottom-12 left-1/2 -translate-x-1/2",
                    "text-center w-full max-w-[180px]", // Slightly wider for better text flow
                    "bg-slate-900/95 text-slate-100 backdrop-blur-sm",
                    "rounded-lg px-3 py-2 shadow-lg"
                  )}
                >
                  <p className="text-amber-300 font-semibold text-sm md:text-base leading-tight">
                    {card.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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
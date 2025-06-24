'use client';

import React from 'react';
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
  
  // Allow only first three cards
  const trio = cards.slice(0, 3);
  
  // Hand-laid offsets for triangle formation (desktop) - adjusted for new origin
  const layout = [
    { x: "-18%", y: "12%", r: -6, z: 1 },   // left card lower
    { x:   "0%", y: "-4%", r:  0, z: 2 },   // centre higher  
    { x:  "18%", y: "14%", r:  6, z: 1 },   // right card lower
  ] as const;

  // Optional: disable transforms on mobile for flat layout
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className={cn(
        "relative z-20",
        "flex items-start gap-8",              // cards get 32px breathing room
        "md:justify-start justify-center",     // desktop left-align, mobile center
        "min-h-[340px]",                       // keeps space for captions
        className
      )}
    >
      {trio.map((card, i) => {
        return (
          <motion.div
            key={card.id}
            className={cn(
              "relative shrink-0",                       // do not scale with flex
              "w-[clamp(160px,18vw,220px)] aspect-[2/3]" // responsive card size
            )}
            style={
              isMobile
                ? { zIndex: 1 }                      // flat row
                : {
                    transform: `translate(${layout[i].x}, ${layout[i].y}) rotate(${layout[i].r}deg)`,
                    zIndex: layout[i].z,
                  }
            }
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ 
              opacity: 1, 
              y: 0, 
              transition: { delay: i * 0.12 } 
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            viewport={{ once: true }}
          >
            <TarotCard
              card={card}
              isReversed={card.isReversed}
              isFlipped={true}
              className="w-full h-full"
              onClick={() => {
                console.log(`Selected card: ${card.name}`);
              }}
            />

            {/* caption bound to card – no leaks */}
            <figcaption
              className={cn(
                "absolute -bottom-9 left-1/2 -translate-x-1/2",
                "text-center text-[clamp(.85rem,1.1vw,.95rem)]",
                "max-w-[20ch] leading-tight",
                "bg-slate-900/85 text-slate-100 backdrop-blur-sm",
                "rounded-md px-2 py-1"
              )}
            >
              <p className="text-amber-300 font-semibold">
                {card.name}
              </p>
              <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">
                {card.keywords.slice(0, 2).join(' • ')}
              </p>
            </figcaption>
          </motion.div>
        );
      })}
    </div>
  );
}; 
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
  
  // Hand-laid offsets for triangle formation (desktop)
  const offsets = [
    { x: "-18%", y: "10%", r: -6, z: 1 },   // left
    { x:   "0%", y: "-6%", r:  0, z: 2 },   // centre (elevated)
    { x:  "18%", y: "12%", r:  6, z: 1 },   // right
  ] as const;

  return (
    <div
      className={cn(
        "relative isolate z-20",
        "flex justify-center gap-0",
        "md:justify-start",
        className
      )}
    >
      {trio.map((card, i) => {
        // Mobile: flat layout, no triangle transforms
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const mobileStyle = { transform: "none" };
        const deskStyle = {
          transform: `translate(${offsets[i].x}, ${offsets[i].y}) rotate(${offsets[i].r}deg)`,
          zIndex: offsets[i].z,
        };

        return (
          <motion.div
            key={card.id}
            className={cn(
              "relative shrink-0",                       // do not scale with flex
              "w-[clamp(160px,18vw,220px)] aspect-[2/3]" // responsive card size
            )}
            style={isMobile ? mobileStyle : deskStyle}
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
              <p className="text-xs text-slate-400 mt-1">
                {card.keywords.slice(0, 2).join(' • ')}
              </p>
            </figcaption>
          </motion.div>
        );
      })}
    </div>
  );
}; 
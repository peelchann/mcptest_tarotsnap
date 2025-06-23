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
  
  // Subtle floating animation base (disabled if user prefers reduced motion)
  const floatingAnimation = prefersReducedMotion ? {} : { 
    y: [0, -4, 0],
    transition: { 
      repeat: Infinity, 
      duration: 10, 
      ease: "easeInOut" 
    }
  };

  // Triangle layout positioning - using safe positioning values
  const layout = [
    { x: -60, y: 20, rotate: -4, z: 0, scale: 1 },      // Left card
    { x: 0,   y: -20, rotate: 0,  z: 10, scale: 1.05 }, // Center card (elevated)
    { x: 60,  y: 30, rotate: 4,   z: 0, scale: 1 },     // Right card
  ];

  return (
    <div className={cn(
      "relative flex justify-center items-center h-full",
      "px-4 py-8 border-4 border-red-500 bg-green-500/20", // DEBUG: visible container
      className
    )}>
      {/* Desktop Triangle Layout */}
      <div className="hidden md:block relative w-full max-w-[600px] h-[400px]">
        {cards.slice(0, 3).map((card, i) => {
          const pos = layout[i];
          return (
            <motion.div
              key={`${card.id}-${i}`}
              className="absolute left-1/2 top-1/2"
              style={{ 
                zIndex: pos.z,
                transform: `translate(-50%, -50%) translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.15 * i,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }
              }}
            >
              <motion.div
                animate={floatingAnimation}
                className="drop-shadow-lg"
                whileHover={{ 
                  scale: pos.scale * 1.05, 
                  rotate: pos.rotate * 1.2,
                  z: pos.z + 5,
                  transition: { duration: 0.3 }
                }}
              >
                <TarotCard
                  card={card}
                  isReversed={card.isReversed}
                  isFlipped={true}
                  className="w-[160px] md:w-[200px] lg:w-[240px] aspect-[2/3]"
                  onClick={() => {
                    console.log(`Selected card: ${card.name}`);
                  }}
                />
                
                {/* Caption with improved typography */}
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + (0.15 * i) }}
                >
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-400/30 mx-auto max-w-[22ch]">
                    <p className="text-sm lg:text-base text-amber-300 font-semibold tracking-wide">
                      {card.name}
                    </p>
                    <p className="text-xs lg:text-sm text-slate-400 mt-1">
                      {card.keywords.slice(0, 2).join(' • ')}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Horizontal Scroll Layout */}
      <div className="md:hidden w-full">
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={`${card.id}-mobile-${i}`}
              className="flex-shrink-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.1 * i }
              }}
            >
              <motion.div
                className="cursor-pointer"
                style={{
                  transform: `rotate(${(i - 1) * 2}deg)` // Subtle rotation even on mobile
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <TarotCard
                  card={card}
                  isReversed={card.isReversed}
                  isFlipped={true}
                  className="w-[140px] aspect-[2/3]"
                  onClick={() => {
                    console.log(`Selected card: ${card.name}`);
                  }}
                />
                
                {/* Mobile Caption */}
                <div className="mt-3 text-center">
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-amber-400/30 mx-auto max-w-[20ch]">
                    <p className="text-sm text-amber-300 font-semibold">
                      {card.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {card.keywords[0]}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
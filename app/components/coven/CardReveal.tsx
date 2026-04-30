'use client';

import { motion } from 'framer-motion';
import TarotCardBack from './TarotCardBack';
import TarotCardFront from './TarotCardFront';
import type { TarotCard } from '@/app/data/cards';

interface CardRevealProps {
  card: Pick<TarotCard, 'name' | 'number' | 'arcana' | 'suit'>;
  width?: number;
  triggered?: boolean;
}

/**
 * CardReveal — 3D Y-flip from back→front over ~1.6s with a purple
 * radial aura expanding behind the card. Once `triggered` flips true
 * (or on mount), the animation runs once.
 */
export default function CardReveal({
  card,
  width = 280,
  triggered = true,
}: CardRevealProps) {
  return (
    <div
      className="relative"
      style={{
        width: width + 80,
        height: (width * 8) / 5 + 80,
        perspective: 1500,
      }}
    >
      {/* purple aura */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={
          triggered ? { scale: 1.05, opacity: 0.6 } : { scale: 0.4, opacity: 0 }
        }
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(122,69,165,0.55)_0%,transparent_65%)] blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        initial={{ rotateY: 0 }}
        animate={triggered ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 m-auto"
        style={{
          width,
          height: (width * 8) / 5,
          transformStyle: 'preserve-3d',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* back face */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <TarotCardBack />
        </div>
        {/* front face */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <TarotCardFront card={card} />
        </div>
      </motion.div>
    </div>
  );
}

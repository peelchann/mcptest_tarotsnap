'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpreadDef } from '@/app/data/spreads';

interface SpreadCardProps {
  spread: SpreadDef;
  className?: string;
  href?: string;
}

/**
 * SpreadCard — mini layout diagram + title + description + hover purple-glow.
 * Renders the spread.layout positions as small gold-bordered rectangles.
 */
export default function SpreadCard({ spread, className, href }: SpreadCardProps) {
  const link = href ?? `/reading/single?spread=${spread.slug}`;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group relative gold-frame rounded-[3px] overflow-hidden',
        'transition-shadow duration-500 hover:shadow-coven-aura',
        className,
      )}
    >
      <Link
        href={link}
        className="relative block p-6 md:p-7 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-soft-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-coven-deep"
        aria-label={`Begin ${spread.name} spread`}
      >
        {/* mini layout diagram */}
        <div
          className="relative mx-auto mb-6 w-full max-w-[220px]"
          style={{ aspectRatio: '5 / 3' }}
        >
          <svg
            viewBox="0 0 100 60"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {spread.layout.map((pos, i) => {
              const x = pos.x;
              const y = pos.y;
              const w = pos.w ?? 12;
              const h = pos.h ?? 18;
              const rotate = pos.rotate ?? 0;
              return (
                <g
                  key={i}
                  transform={`translate(${x} ${y}) rotate(${rotate})`}
                >
                  <rect
                    x={-w / 2}
                    y={-h / 2}
                    width={w}
                    height={h}
                    rx="0.6"
                    fill="rgba(36,18,47,0.85)"
                    stroke="rgba(216,182,106,0.6)"
                    strokeWidth="0.5"
                  />
                  <rect
                    x={-w / 2 + 1.2}
                    y={-h / 2 + 1.2}
                    width={w - 2.4}
                    height={h - 2.4}
                    rx="0.4"
                    fill="none"
                    stroke="rgba(216,182,106,0.32)"
                    strokeWidth="0.3"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fontSize="3.4"
                    fill="#D8B66A"
                    fontFamily="Cormorant Garamond, Georgia, serif"
                    fontStyle="italic"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="text-center space-y-3">
          <span className="coven-kicker text-[0.65rem] tracking-[0.32em]">
            {spread.cardCount} card{spread.cardCount === 1 ? '' : 's'}
          </span>
          <h3 className="font-serif text-2xl text-coven-bone leading-tight">
            {spread.name}
          </h3>
          <p className="text-sm text-coven-fog font-sans font-light leading-relaxed">
            {spread.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[rgba(176,138,73,0.25)] flex items-center justify-center gap-2 text-coven-soft-gold text-xs tracking-[0.28em] uppercase">
          <span className="opacity-80 group-hover:opacity-100 transition-opacity">Begin</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* corner stars */}
        {[
          'top-3 left-3',
          'top-3 right-3',
          'bottom-3 left-3',
          'bottom-3 right-3',
        ].map((cls, i) => (
          <span
            key={i}
            className={`absolute ${cls} text-coven-soft-gold/45 text-[10px]`}
            aria-hidden="true"
          >
            ✦
          </span>
        ))}
      </Link>
    </motion.div>
  );
}

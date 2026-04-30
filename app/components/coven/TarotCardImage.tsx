'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import TarotCardSurface from './TarotCardSurface';

interface TarotCardImageProps {
  src: string;
  alt: string;
  /**
   * Optional fixed width in px. When omitted, the image fills its
   * container — preferred for responsive Tailwind-sized wrappers.
   */
  width?: number;
  /** Higher visual priority on the central hero card. */
  priority?: boolean;
  className?: string;
  /**
   * Slightly tones down the image so it feels integrated with the
   * Coven Luxe palette (some assets are warmer than the design system).
   */
  toneIntegration?: boolean;
}

/**
 * TarotCardImage — a real tarot face image rendered inside the
 * TarotCardSurface frame. Adds an inner gold rim highlight, a soft
 * outer shadow, and an optional plum tone-integration overlay so the
 * artwork blends with the Coven Luxe atmosphere.
 *
 * Aspect ratio is locked to 5:8 by the surface; the image fills it.
 */
export default function TarotCardImage({
  src,
  alt,
  width,
  priority = false,
  className,
  toneIntegration = true,
}: TarotCardImageProps) {
  return (
    <TarotCardSurface
      width={width}
      innerRing
      className={cn(
        'shadow-[0_18px_42px_-12px_rgba(0,0,0,0.85),0_2px_0_rgba(216,182,106,0.12)_inset]',
        'transform-gpu',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 280px, 50vw"
        priority={priority}
        className="object-cover"
        draggable={false}
      />

      {/* tone integration: subtle plum darken so warm artwork sits in the dark UI */}
      {toneIntegration && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background:
              'linear-gradient(180deg, rgba(36,18,47,0.18) 0%, rgba(11,8,16,0.0) 35%, rgba(11,8,16,0.0) 65%, rgba(36,18,47,0.30) 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* inner gold rim highlight (sits inside the existing innerRing) */}
      <div
        className="pointer-events-none absolute inset-[10px] rounded-[2px]"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(216,182,106,0.18), inset 0 0 18px rgba(216,182,106,0.08)',
        }}
        aria-hidden="true"
      />
    </TarotCardSurface>
  );
}

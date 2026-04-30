'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  FALLBACK_HERO_CARDS,
  HERO_CARD_ASSETS,
  type HeroCardAsset,
  getRandomUniqueCards,
} from '@/app/data/heroCardAssets';
import TarotCardImage from './TarotCardImage';

/**
 * HeroTarotFan — the homepage hero's 3-card fan.
 *
 * Implements the TarotSnap Hero Motion System:
 *  - Initial load: parent variants stagger child cards in.
 *  - Ambient bloom: purple aura behind cards pulses slowly.
 *  - Card drift: each card has its own y oscillation + tiny rotation
 *    delta, with phase offsets.
 *  - Pointer parallax (desktop only): the whole stack tilts up to
 *    ~3-4° in response to cursor; cards translate sub-pixel.
 *  - Hover state: center card lifts, side cards separate, aura intensifies.
 *  - Reduced motion: drift + parallax disabled, gentle fade only.
 *
 * Cards are real face images chosen randomly per page load. SSR renders
 * a deterministic fallback (so server/client markup matches), then the
 * client useEffect swaps to random selection after mount with no layout
 * shift (positions/dimensions are identical).
 */
export default function HeroTarotFan() {
  const reduce = useReducedMotion();
  const [cards, setCards] = useState<HeroCardAsset[]>(FALLBACK_HERO_CARDS);
  const [hovered, setHovered] = useState(false);

  // After mount, swap the deterministic fallback for a random trio.
  useEffect(() => {
    setCards(getRandomUniqueCards(HERO_CARD_ASSETS, 3));
  }, []);

  // Pointer parallax — desktop-style tilt for the whole stack.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-1, 1], [-4, 4]), {
    stiffness: 80,
    damping: 18,
    mass: 0.6,
  });
  const tiltX = useSpring(useTransform(my, [-1, 1], [2, -2]), {
    stiffness: 80,
    damping: 18,
    mass: 0.6,
  });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    if (e.pointerType !== 'mouse') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(x * 2 - 1);
    my.set(y * 2 - 1);
  }
  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  // Card drift loop — disabled under reduced-motion.
  function driftProps(delaySec: number, dy = 6) {
    if (reduce) return {};
    return {
      animate: {
        y: [0, -dy, 0, dy * 0.55, 0],
        rotate: [0, 0.4, 0, -0.4, 0],
      },
      transition: {
        duration: 6.5 + delaySec * 0.4,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        delay: delaySec,
      },
    };
  }

  // Hover state offsets (added on top of base position via animate).
  // Center lifts, sides separate slightly outward.
  const centerHover = hovered && !reduce ? { y: -14, scale: 1.02 } : { y: 0, scale: 1 };
  const leftHover = hovered && !reduce ? { x: -10, rotate: -14 } : { x: 0, rotate: -12 };
  const rightHover = hovered && !reduce ? { x: 10, rotate: 14 } : { x: 0, rotate: 12 };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.15,
      },
    },
  };
  const cardEnter = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.9, ease: [0.22, 0.8, 0.32, 1] },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative mx-auto max-w-md aspect-[4/5] flex items-center justify-center"
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Ambient bloom — pulsing purple aura behind everything */}
      <motion.div
        aria-hidden="true"
        className={`absolute inset-0 -m-10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          hovered ? 'opacity-100' : 'opacity-80'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(157,98,211,0.42) 0%, rgba(122,69,165,0.22) 35%, transparent 70%)',
        }}
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.55, 0.85, 0.55],
                scale: [0.96, 1.04, 0.96],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
              }
        }
      />

      {/* Whole stack tilts as a unit on pointer parallax */}
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateY: reduce ? 0 : tiltY,
          rotateX: reduce ? 0 : tiltX,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* LEFT card */}
        <motion.div
          variants={cardEnter}
          className="absolute left-[6%] top-[18%] w-[42%] z-[1]"
          style={{ transformOrigin: 'bottom right' }}
          animate={leftHover}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <motion.div {...driftProps(0.45, 5)} className="will-change-transform">
            <TarotCardImage
              src={cards[1]?.src ?? FALLBACK_HERO_CARDS[1].src}
              alt={cards[1]?.name ?? FALLBACK_HERO_CARDS[1].name}
              width={210}
            />
          </motion.div>
        </motion.div>

        {/* RIGHT card */}
        <motion.div
          variants={cardEnter}
          className="absolute right-[6%] top-[18%] w-[42%] z-[1]"
          style={{ transformOrigin: 'bottom left' }}
          animate={rightHover}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <motion.div {...driftProps(0.85, 5)} className="will-change-transform">
            <TarotCardImage
              src={cards[2]?.src ?? FALLBACK_HERO_CARDS[2].src}
              alt={cards[2]?.name ?? FALLBACK_HERO_CARDS[2].name}
              width={210}
            />
          </motion.div>
        </motion.div>

        {/* CENTER card — most important, foreground */}
        <motion.div
          variants={cardEnter}
          className="absolute left-1/2 top-[6%] -translate-x-1/2 w-[48%] z-[3]"
          animate={centerHover}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* center-card focused aura — intensifies on hover */}
          <div
            className={`absolute -inset-6 rounded-full pointer-events-none transition-opacity duration-700 ${
              hovered ? 'opacity-90' : 'opacity-55'
            }`}
            style={{
              background:
                'radial-gradient(circle at 50% 55%, rgba(157,98,211,0.48) 0%, rgba(77,42,103,0.18) 50%, transparent 75%)',
              filter: 'blur(20px)',
            }}
            aria-hidden="true"
          />
          <motion.div {...driftProps(0, 7)} className="relative will-change-transform">
            <TarotCardImage
              src={cards[0]?.src ?? FALLBACK_HERO_CARDS[0].src}
              alt={cards[0]?.name ?? FALLBACK_HERO_CARDS[0].name}
              width={240}
              priority
            />
          </motion.div>
        </motion.div>

        {/* tiny floating star marks around the fan */}
        {[
          { left: '5%', top: '10%' },
          { left: '92%', top: '14%' },
          { left: '7%', top: '88%' },
          { left: '90%', top: '85%' },
        ].map((s, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute text-coven-soft-gold/55 text-base"
            style={s}
            animate={
              reduce
                ? { opacity: 0.55 }
                : {
                    opacity: [0.35, 0.85, 0.35],
                    scale: [0.9, 1.05, 0.9],
                  }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 3.6,
                    delay: i * 0.6,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }
            }
          >
            ✦
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  type Variants,
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
 * HeroTarotFan — homepage hero 3-card fan, choreographed per the
 * "TarotSnap Hero Animation Storyboard" reference.
 *
 * 6-phase storyboard:
 *   1. Pre-summon (0–350ms): cards invisible, container settles in.
 *   2. Center arrival (350–900ms): the chosen card rises and dominates.
 *   3. Side fan-open (700–1300ms): left & right cards slide out from
 *      behind center to their fanned positions.
 *   4. Aura bloom + ritual ring (900–1800ms): purple aura, gold floor
 *      ring, and deterministic gold sparks fade in.
 *   5. Idle loop (after 1800ms): each card breathes with its own
 *      independent y/rotate oscillation; aura pulses; sparks twinkle.
 *   6. Pointer parallax + hover/focus: desktop-only stage tilt up to
 *      ±4°; on hover the center lifts, sides ease outward, aura
 *      intensifies. Reduced-motion users get the static end-state.
 *
 * Hydration safety:
 *   SSR + first paint render `FALLBACK_HERO_CARDS` (deterministic).
 *   `useEffect` then swaps to a random unique trio after mount.
 *   Card frame dimensions and stage anchor are identical between
 *   fallback and random, so there is zero layout shift on swap.
 */
export default function HeroTarotFan() {
  const reduce = useReducedMotion();
  const [cards, setCards] = useState<HeroCardAsset[]>(FALLBACK_HERO_CARDS);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Random card swap (post-mount, hydration-safe).
  useEffect(() => {
    setCards(getRandomUniqueCards(HERO_CARD_ASSETS, 3));
  }, []);

  // Responsive offset scaling — desktop fans wider than mobile.
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // === Pointer parallax (desktop mouse only) ===
  const stageRef = useRef<HTMLDivElement | null>(null);
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
    if (reduce || e.pointerType !== 'mouse') return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  // === Card variants (entrance + hover targets) ===
  const EASE: [number, number, number, number] = [0.22, 0.8, 0.32, 1];

  const variants = useMemo(() => {
    const xOffset = isMobile ? 95 : 145;
    const yOffsetSide = isMobile ? 22 : 28;
    const xHoverOffset = isMobile ? 105 : 158;

    const center: Variants = {
      hidden: { opacity: 0, x: 0, y: 30, scale: 0.92, rotate: 1 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1.12,
        rotate: 0,
        transition: { duration: 0.8, delay: 0.25, ease: EASE },
      },
      hover: {
        opacity: 1,
        x: 0,
        y: -16,
        scale: 1.18,
        rotate: 0,
        transition: { type: 'spring', stiffness: 220, damping: 22 },
      },
    };
    const left: Variants = {
      hidden: { opacity: 0, x: -30, y: 30, scale: 0.86, rotate: -3 },
      visible: {
        opacity: 1,
        x: -xOffset,
        y: yOffsetSide,
        scale: 0.95,
        rotate: -12,
        transition: { duration: 0.9, delay: 0.55, ease: EASE },
      },
      hover: {
        opacity: 1,
        x: -xHoverOffset,
        y: yOffsetSide - 6,
        scale: 0.98,
        rotate: -14,
        transition: { type: 'spring', stiffness: 220, damping: 22 },
      },
    };
    const right: Variants = {
      hidden: { opacity: 0, x: 30, y: 30, scale: 0.86, rotate: 3 },
      visible: {
        opacity: 1,
        x: xOffset,
        y: yOffsetSide,
        scale: 0.95,
        rotate: 12,
        transition: { duration: 0.9, delay: 0.65, ease: EASE },
      },
      hover: {
        opacity: 1,
        x: xHoverOffset,
        y: yOffsetSide - 6,
        scale: 0.98,
        rotate: 14,
        transition: { type: 'spring', stiffness: 220, damping: 22 },
      },
    };
    return { center, left, right };
  }, [isMobile]);

  // === Idle loops — start AFTER entrance settles (~1.8s) ===
  const IDLE_DELAY = 1.8;
  const idleTransition = (duration: number, delay: number) =>
    ({
      duration,
      ease: 'easeInOut' as const,
      repeat: Infinity,
      delay: IDLE_DELAY + delay,
    });

  const centerIdle = reduce
    ? {}
    : {
        animate: {
          y: [0, -8, 0, 5, 0],
          rotate: [0, 0.4, 0, -0.3, 0],
        },
        transition: idleTransition(6.8, 0),
      };
  const leftIdle = reduce
    ? {}
    : {
        animate: {
          y: [0, -10, 0, 6, 0],
          rotate: [0, 0.8, -0.5, 0],
        },
        transition: idleTransition(7.4, 0.2),
      };
  const rightIdle = reduce
    ? {}
    : {
        animate: {
          y: [0, -8, 0, 7, 0],
          rotate: [0, -0.8, 0.6, 0],
        },
        transition: idleTransition(7.1, 0.45),
      };

  // === Deterministic sparks (no Math.random in render) ===
  const SPARKS = [
    { left: '8%', top: '14%', size: 6, delay: 1.10 },
    { left: '88%', top: '18%', size: 8, delay: 1.20 },
    { left: '12%', top: '78%', size: 5, delay: 1.30 },
    { left: '90%', top: '70%', size: 7, delay: 1.40 },
    { left: '20%', top: '92%', size: 6, delay: 1.50 },
    { left: '78%', top: '88%', size: 8, delay: 1.60 },
    { left: '50%', top: '4%', size: 5, delay: 1.70 },
  ];

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative mx-auto w-full"
      style={{
        height: 'clamp(340px, 36vw, 460px)',
        maxWidth: 560,
        perspective: 1200,
      }}
    >
      {/* === Phase 4 — Ambient aura bloom (also idle pulses) === */}
      <motion.div
        aria-hidden="true"
        className={
          'absolute inset-0 -m-8 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ' +
          (hovered ? 'opacity-100' : 'opacity-90')
        }
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(157,98,211,0.50) 0%, rgba(122,69,165,0.24) 35%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={
          reduce
            ? { opacity: 0.9, scale: 1 }
            : {
                opacity: [0, 0.55, 0.85, 0.6, 0.85],
                scale: [0.92, 1, 1.04, 1, 1.04],
              }
        }
        transition={
          reduce
            ? { duration: 0.8, delay: 0.35 }
            : {
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: 0.35,
                times: [0, 0.12, 0.4, 0.7, 1],
              }
        }
      />

      {/* === Phase 4 — Ritual floor glow (elliptical) === */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: '4%',
          width: '78%',
          height: '14%',
          background:
            'radial-gradient(ellipse at center, rgba(157,98,211,0.50) 0%, rgba(122,69,165,0.20) 32%, transparent 65%)',
          filter: 'blur(28px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: hovered ? 0.75 : 0.55,
          scale: 1,
        }}
        transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
      />

      {/* === Phase 4 — Thin gold ritual ring outline === */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          bottom: '9%',
          width: '64%',
          height: '7%',
          border: '1px solid rgba(216,182,106,0.24)',
          boxShadow:
            '0 0 24px rgba(216,182,106,0.18), inset 0 0 14px rgba(216,182,106,0.10)',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: hovered ? 0.65 : 0.45,
          scale: 1,
        }}
        transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
      />

      {/* === Phase 4 — Gold sparks === */}
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute text-coven-soft-gold"
          style={{
            left: s.left,
            top: s.top,
            fontSize: `${s.size}px`,
            lineHeight: 1,
            textShadow: '0 0 8px rgba(216,182,106,0.6)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            reduce
              ? { opacity: 0.6, scale: 1 }
              : {
                  opacity: [0, 0.7, 0.3, 0.8, 0.45],
                  scale: [0.6, 1, 0.95, 1.08, 1],
                }
          }
          transition={
            reduce
              ? { duration: 0.6, delay: s.delay }
              : {
                  duration: 4 + i * 0.2,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          ✦
        </motion.span>
      ))}

      {/* === Card stage with parallax tilt === */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotateX: reduce ? 0 : tiltX,
          rotateY: reduce ? 0 : tiltY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Center anchor — all three cards share this 0,0 origin */}
        <div className="relative">
          {/* === LEFT card === */}
          <motion.div
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
            initial="hidden"
            animate={hovered ? 'hover' : 'visible'}
            variants={variants.left}
          >
            <motion.div {...leftIdle} className="will-change-transform">
              <div className="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[210px]">
                <TarotCardImage
                  src={cards[1]?.src ?? FALLBACK_HERO_CARDS[1].src}
                  alt={cards[1]?.name ?? FALLBACK_HERO_CARDS[1].name}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* === RIGHT card === */}
          <motion.div
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
            initial="hidden"
            animate={hovered ? 'hover' : 'visible'}
            variants={variants.right}
          >
            <motion.div {...rightIdle} className="will-change-transform">
              <div className="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[210px]">
                <TarotCardImage
                  src={cards[2]?.src ?? FALLBACK_HERO_CARDS[2].src}
                  alt={cards[2]?.name ?? FALLBACK_HERO_CARDS[2].name}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* === CENTER card — chosen card, dominant === */}
          <motion.div
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-30 will-change-transform"
            initial="hidden"
            animate={hovered ? 'hover' : 'visible'}
            variants={variants.center}
          >
            {/* Center-card focus aura — intensifies on hover */}
            <div
              className={
                'absolute -inset-6 rounded-full pointer-events-none transition-opacity duration-700 ' +
                (hovered ? 'opacity-100' : 'opacity-65')
              }
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(157,98,211,0.55) 0%, rgba(77,42,103,0.22) 50%, transparent 75%)',
                filter: 'blur(20px)',
              }}
              aria-hidden="true"
            />
            <motion.div {...centerIdle} className="relative will-change-transform">
              <div className="w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px]">
                <TarotCardImage
                  src={cards[0]?.src ?? FALLBACK_HERO_CARDS[0].src}
                  alt={cards[0]?.name ?? FALLBACK_HERO_CARDS[0].name}
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

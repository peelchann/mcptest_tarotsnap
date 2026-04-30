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
 * Visible motion design:
 *   1. Pre-summon (0–200ms): cards hidden, blurred, low + small.
 *   2. Center arrives first (200–1050ms): rises 90px → -12px with a
 *      subtle overshoot to -18px, scales 0.72 → 1.18 → 1.14, blur clears.
 *   3. Left fan-opens (650–1600ms): slides from x:-20 (behind center)
 *      out to x:-168 with overshoot then settles at -155, rotates
 *      -2° → -15° → -13°, blur clears.
 *   4. Right mirrors (750–1700ms).
 *   5. Idle (after entrance): each card breathes with visibly bigger
 *      keyframes — center y oscillates -12 ↔ -24, sides ±5px x sway
 *      and ±12px y bob plus ±1.2° rotation drift.
 *   6. Atmosphere: aura blooms (opacity 0 → 0.78 peak), pulses
 *      0.50 ↔ 0.78. Floor ring 0 → 0.48 idle pulse. 9 deterministic
 *      gold sparks pulse opacity 0.15 ↔ 0.8.
 *   7. Pointer parallax (mouse-only): ±4° rotateY, ±2° rotateX.
 *   8. Hover: center lifts y → -34, scale → 1.19; sides splay to
 *      ±178 and y 18; aura + ring brighten.
 *
 * Phase state machine (entrance → idle) ensures hover toggling never
 * re-triggers entrance keyframes.
 *
 * Hydration safety: SSR + first paint render `FALLBACK_HERO_CARDS`,
 * useEffect swaps to `getRandomUniqueCards(...)` after mount.
 */
export default function HeroTarotFan() {
  const reduce = useReducedMotion();
  const [cards, setCards] = useState<HeroCardAsset[]>(FALLBACK_HERO_CARDS);
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState<'entrance' | 'idle'>('entrance');
  const [isMobile, setIsMobile] = useState(false);

  // Random card swap (post-mount, hydration-safe).
  useEffect(() => {
    setCards(getRandomUniqueCards(HERO_CARD_ASSETS, 3));
  }, []);

  // Responsive offset scaling — mobile fans a tighter trio.
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

  // === Variants ===
  const ENTRANCE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const variants = useMemo(() => {
    // Mobile shrinks fan width by ~35% so cards don't touch the screen edges.
    const mob = isMobile;
    const xSettle = mob ? 100 : 155;
    const xOver = mob ? 110 : 168;
    const xHover = mob ? 116 : 178;
    const ySettle = mob ? 22 : 28;
    const yOver = mob ? 16 : 22;
    const yHoverSide = mob ? 12 : 18;

    const center: Variants = {
      hidden: {
        opacity: 0,
        x: 0,
        y: 90,
        scale: 0.72,
        rotate: -4,
        filter: 'blur(8px)',
      },
      entrance: {
        opacity: [0, 1, 1],
        x: [0, 0, 0],
        y: [90, -18, -12],
        scale: [0.72, 1.18, 1.14],
        rotate: [-4, 1, 0],
        filter: ['blur(8px)', 'blur(0px)', 'blur(0px)'],
        transition: {
          duration: 1.0,
          delay: 0.20,
          ease: ENTRANCE_EASE,
          times: [0, 0.62, 1],
        },
      },
      visible: {
        opacity: 1,
        x: 0,
        y: -12,
        scale: 1.14,
        rotate: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 240, damping: 26 },
      },
      hover: {
        opacity: 1,
        x: 0,
        y: -34,
        scale: 1.19,
        rotate: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 220, damping: 22 },
      },
    };

    const left: Variants = {
      hidden: {
        opacity: 0,
        x: -20,
        y: 105,
        scale: 0.68,
        rotate: -2,
        filter: 'blur(10px)',
      },
      entrance: {
        opacity: [0, 1, 1],
        x: [-20, -xOver, -xSettle],
        y: [105, yOver, ySettle],
        scale: [0.68, 0.99, 0.96],
        rotate: [-2, -15, -13],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
        transition: {
          duration: 1.05,
          delay: 0.65,
          ease: ENTRANCE_EASE,
          times: [0, 0.65, 1],
        },
      },
      visible: {
        opacity: 1,
        x: -xSettle,
        y: ySettle,
        scale: 0.96,
        rotate: -13,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 240, damping: 26 },
      },
      hover: {
        opacity: 1,
        x: -xHover,
        y: yHoverSide,
        scale: 1.0,
        rotate: -16,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 220, damping: 22 },
      },
    };

    const right: Variants = {
      hidden: {
        opacity: 0,
        x: 20,
        y: 105,
        scale: 0.68,
        rotate: 2,
        filter: 'blur(10px)',
      },
      entrance: {
        opacity: [0, 1, 1],
        x: [20, xOver, xSettle],
        y: [105, yOver, ySettle],
        scale: [0.68, 0.99, 0.96],
        rotate: [2, 15, 13],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
        transition: {
          duration: 1.05,
          delay: 0.75,
          ease: ENTRANCE_EASE,
          times: [0, 0.65, 1],
        },
      },
      visible: {
        opacity: 1,
        x: xSettle,
        y: ySettle,
        scale: 0.96,
        rotate: 13,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 240, damping: 26 },
      },
      hover: {
        opacity: 1,
        x: xHover,
        y: yHoverSide,
        scale: 1.0,
        rotate: 16,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 220, damping: 22 },
      },
    };
    return { center, left, right };
  }, [isMobile]);

  // === Idle inner-loop keyframes (relative offsets layered on top of
  // the outer's settled position; visible enough to read as motion).
  const centerIdle = reduce
    ? {}
    : {
        animate: {
          y: [0, -12, 0, 6, 0],
          rotate: [0, 0.7, 0, -0.5, 0],
        },
        transition: {
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      };
  const leftIdle = reduce
    ? {}
    : {
        animate: {
          y: [0, -12, 0, 6, 0],
          x: [0, -5, 0, 5, 0],
          rotate: [0, 1.2, 0, -1.2, 0],
        },
        transition: {
          duration: 7.4,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      };
  const rightIdle = reduce
    ? {}
    : {
        animate: {
          y: [0, -10, 0, 7, 0],
          x: [0, 5, 0, -5, 0],
          rotate: [0, -1.2, 0, 1.2, 0],
        },
        transition: {
          duration: 7.1,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      };

  // === Deterministic sparks ===
  const SPARKS = [
    { left: '8%',  top: '14%', size: 4, delay: 0.10, dur: 3.0 },
    { left: '88%', top: '18%', size: 3, delay: 0.40, dur: 3.4 },
    { left: '12%', top: '78%', size: 4, delay: 0.30, dur: 3.2 },
    { left: '90%', top: '70%', size: 3, delay: 0.55, dur: 2.8 },
    { left: '20%', top: '92%', size: 4, delay: 0.50, dur: 3.6 },
    { left: '78%', top: '88%', size: 3, delay: 0.70, dur: 3.0 },
    { left: '50%', top: '4%',  size: 3, delay: 0.20, dur: 3.4 },
    { left: '5%',  top: '46%', size: 3, delay: 0.85, dur: 2.6 },
    { left: '94%', top: '42%', size: 3, delay: 0.25, dur: 3.8 },
  ];

  // Compute the active "outer" target for hover/visible after entrance.
  const outerStateForCenter =
    phase === 'entrance' ? 'entrance' : hovered ? 'hover' : 'visible';
  const outerStateForSides = outerStateForCenter; // same string, different variant maps

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
        height: 'clamp(360px, 38vw, 480px)',
        maxWidth: 580,
        perspective: 1200,
      }}
    >
      {/* === Aura bloom — opacity 0 → 0.78 entrance, 0.50↔0.78 idle pulse === */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -m-6 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(157,98,211,0.55) 0%, rgba(122,69,165,0.26) 35%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={
          reduce
            ? { opacity: 0.65, scale: 1 }
            : {
                opacity: hovered ? [0.78, 0.92, 0.78] : [0.50, 0.78, 0.50],
                scale: hovered ? [1.04, 1.12, 1.04] : [0.98, 1.06, 0.98],
              }
        }
        transition={
          reduce
            ? { duration: 1.4, delay: 0.45 }
            : {
                duration: 6,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: 0.45,
              }
        }
      />

      {/* === Floor ritual glow (gold + plum elliptical) === */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: '12%',
          width: '64%',
          height: '22%',
          transform: 'translateX(-50%)',
          borderRadius: '9999px',
          background:
            'radial-gradient(ellipse at center, rgba(216,182,106,0.26) 0%, rgba(122,69,165,0.18) 35%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          reduce
            ? { opacity: 0.42, scale: 1 }
            : {
                opacity: hovered
                  ? [0.55, 0.72, 0.55]
                  : [0.32, 0.52, 0.32],
                scale: [0.98, 1.04, 0.98],
              }
        }
        transition={
          reduce
            ? { duration: 0.9, delay: 0.9, ease: ENTRANCE_EASE }
            : {
                duration: 5.5,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: 0.9,
              }
        }
      />

      {/* === Thin gold ritual ring (above the floor glow) === */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: '18%',
          width: '52%',
          height: '8%',
          transform: 'translateX(-50%)',
          borderRadius: '9999px',
          border: '1px solid rgba(216,182,106,0.30)',
          boxShadow:
            '0 0 28px rgba(216,182,106,0.22), inset 0 0 14px rgba(216,182,106,0.12)',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: hovered ? 0.65 : 0.45,
          scale: 1,
        }}
        transition={{ duration: 0.95, delay: 0.95, ease: ENTRANCE_EASE }}
      />

      {/* === Sparks (dot + box-shadow glow) === */}
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: '#D8B66A',
            boxShadow:
              '0 0 10px rgba(216,182,106,0.85), 0 0 18px rgba(157,98,211,0.45)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            reduce
              ? { opacity: 0.55, scale: 1 }
              : {
                  opacity: [0.15, 0.85, 0.15],
                  scale: [0.8, 1.35, 0.8],
                }
          }
          transition={
            reduce
              ? { duration: 0.6, delay: 0.6 + s.delay }
              : {
                  duration: s.dur,
                  delay: 0.6 + s.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
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
        {/*
          CARD STRUCTURE (3 layers per card):
            Layer 1 (static <div>): owns the centering transform via
              inline 'translate(-50%, -50%)'. Never touched by framer.
            Layer 2 (motion.div): entrance / visible / hover targets.
              `phase` state machine ensures we don't re-play entrance
              keyframes when hover toggles.
            Layer 3 (motion.div): idle oscillation. Composes on top of
              layer 2's settled state so motion is visibly additive.
        */}
        <div className="relative">
          {/* === LEFT card === */}
          <div
            className="absolute z-20"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="will-change-transform"
              initial="hidden"
              animate={outerStateForSides}
              variants={variants.left}
              onAnimationComplete={(def) => {
                if (def === 'entrance') setPhase('idle');
              }}
            >
              <motion.div
                {...(phase === 'idle' ? leftIdle : {})}
                className="will-change-transform"
              >
                <div className="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[210px]">
                  <TarotCardImage
                    src={cards[1]?.src ?? FALLBACK_HERO_CARDS[1].src}
                    alt={cards[1]?.name ?? FALLBACK_HERO_CARDS[1].name}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* === RIGHT card === */}
          <div
            className="absolute z-20"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="will-change-transform"
              initial="hidden"
              animate={outerStateForSides}
              variants={variants.right}
            >
              <motion.div
                {...(phase === 'idle' ? rightIdle : {})}
                className="will-change-transform"
              >
                <div className="w-[150px] sm:w-[180px] md:w-[200px] lg:w-[210px]">
                  <TarotCardImage
                    src={cards[2]?.src ?? FALLBACK_HERO_CARDS[2].src}
                    alt={cards[2]?.name ?? FALLBACK_HERO_CARDS[2].name}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* === CENTER card — chosen card, dominant === */}
          <div
            className="absolute z-30"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="relative will-change-transform"
              initial="hidden"
              animate={outerStateForCenter}
              variants={variants.center}
            >
              {/* center-card focus aura (tighter than the global aura) */}
              <div
                className={
                  'absolute -inset-6 rounded-full pointer-events-none transition-opacity duration-700 ' +
                  (hovered ? 'opacity-100' : 'opacity-70')
                }
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(157,98,211,0.60) 0%, rgba(77,42,103,0.24) 50%, transparent 75%)',
                  filter: 'blur(20px)',
                }}
                aria-hidden="true"
              />
              <motion.div
                {...(phase === 'idle' ? centerIdle : {})}
                className="relative will-change-transform"
              >
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
        </div>
      </motion.div>
    </div>
  );
}

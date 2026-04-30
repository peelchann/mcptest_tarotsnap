'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  Sparkles,
  Lock,
  Feather,
  Layers,
  ArrowRight,
} from 'lucide-react';

import RitualButton from './coven/RitualButton';
import GhostButton from './coven/GhostButton';
import SectionFrame from './coven/SectionFrame';
import DecorativeDivider from './coven/DecorativeDivider';
import FeatureCard from './coven/FeatureCard';
import RitualStep from './coven/RitualStep';
import SpreadCard from './coven/SpreadCard';
import JournalCard from './coven/JournalCard';
import ThemeInsightCard from './coven/ThemeInsightCard';
import HeroTarotFan from './coven/HeroTarotFan';
import QuotaPill from './coven/QuotaPill';
import LogoMark from './coven/LogoMark';
import { SPREADS } from '@/app/data/spreads';
import { MOCK_JOURNAL_ENTRIES, MOCK_THEMES } from '@/app/data/journalMock';

/**
 * NewHomepage — the Coven Luxe landing page.
 * 70% Coven Luxe / 20% Archive of Witches / 10% clean product UI.
 */
export default function NewHomepage() {
  return (
    <div className="relative pb-24">
      <Hero />
      <DecorativeDivider symbol="diamond" />
      <Features />
      <DecorativeDivider symbol="star" />
      <TheRitual />
      <DecorativeDivider symbol="diamond" />
      <ChooseSpread />
      <DecorativeDivider symbol="sigil" />
      <GrimoireTeaser />
      <Footer />
    </div>
  );
}

/* ────────────────── Hero ────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="smoke-layer" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-6 inline-flex items-center gap-3"
            >
              <span className="inline-block w-10 h-px bg-gradient-to-r from-transparent to-[rgba(216,182,106,0.7)]" aria-hidden="true" />
              <span className="coven-kicker">An AI mystic that remembers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="font-serif text-coven-bone leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
            >
              Your AI Mystic
              <span className="block italic text-coven-soft-gold/95 mt-1">
                That Remembers
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
              className="mt-7 max-w-xl text-coven-fog font-sans text-base md:text-lg leading-[1.75] font-light"
            >
              Ask the cards. Receive a reading shaped not just by archetype, but
              by every conversation you&apos;ve had with the deck before. A
              quiet, evolving grimoire — yours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <RitualButton size="lg" asChild>
                <Link href="/reading/single">Enter the Ritual</Link>
              </RitualButton>
              <GhostButton size="lg" asChild>
                <Link href="/spreads">View Spreads</Link>
              </GhostButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-7 flex items-center gap-3 text-coven-fog/70 text-xs"
            >
              <QuotaPill remaining={3} total={3} label="Free readings" />
              <span className="hidden sm:inline-block">·</span>
              <span className="hidden sm:inline-block tracking-[0.18em] uppercase text-[0.66rem]">
                No card required
              </span>
            </motion.div>
          </div>

          {/* Card fan — see HeroTarotFan for full motion system */}
          <div className="lg:col-span-5">
            <HeroTarotFan />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────── Features ────────────────── */

const FEATURES = [
  {
    icon: BookOpen,
    title: 'It Remembers',
    body: 'Every reading saves to your private grimoire. Return tomorrow and the deck recalls today.',
  },
  {
    icon: Eye,
    title: 'It Sees Patterns',
    body: 'Recurring cards, themes, and questions surface as quiet insights — not noise.',
  },
  {
    icon: Sparkles,
    title: 'It Grows With You',
    body: 'The voice of the reading sharpens to your tone, your seasons, your real life.',
  },
  {
    icon: Lock,
    title: 'Your Private Grimoire',
    body: 'End-to-end private. Anonymous by default. Sign in only when you want continuity across devices.',
  },
];

function Features() {
  return (
    <SectionFrame
      kicker="What it is"
      title={<>A reading that <span className="italic text-coven-soft-gold">stays with you</span></>}
      body="Most tarot apps deal cards. TarotSnap holds a thread between sessions, so the deck speaks to who you are becoming, not who you were the first time."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
        ))}
      </div>
    </SectionFrame>
  );
}

/* ────────────────── The Ritual (steps) ────────────────── */

const STEPS = [
  {
    icon: Feather,
    title: 'Ask',
    body: 'Whisper the question that has been circling. Specific is better than safe.',
  },
  {
    icon: Layers,
    title: 'Draw',
    body: 'A single card steps forward. Not random — selected from the energy of the moment.',
  },
  {
    icon: Eye,
    title: 'Receive',
    body: 'The reading arrives in three voices: meaning, guidance, timing. You may dwell as long as you wish.',
  },
  {
    icon: BookOpen,
    title: 'Return',
    body: 'The card joins your grimoire. The next reading remembers. The thread continues.',
  },
];

function TheRitual() {
  return (
    <SectionFrame
      kicker="The ritual"
      title={<>Four steps, <span className="italic text-coven-soft-gold">honored</span> each time</>}
      body="No clutter, no upsell, no rush. The cadence of a reading is the point — let it slow you down, let it hold attention."
    >
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative">
              <RitualStep step={i + 1} icon={s.icon} title={s.title} body={s.body} />
              {/* connector arrow on desktop, except after last step */}
              {i < STEPS.length - 1 && (
                <span
                  className="hidden md:flex absolute top-9 -right-3 z-10 text-coven-soft-gold/60"
                  aria-hidden="true"
                >
                  <svg width="32" height="14" viewBox="0 0 32 14" fill="none" stroke="currentColor" strokeWidth="0.9">
                    <line x1="0" y1="7" x2="26" y2="7" strokeDasharray="2 3" />
                    <path d="M22 3 L28 7 L22 11" fill="none" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

/* ────────────────── Choose your spread ────────────────── */

function ChooseSpread() {
  return (
    <SectionFrame
      kicker="Choose your spread"
      title={<>Six ways to <span className="italic text-coven-soft-gold">listen</span></>}
      body="One question. Different geometries of attention. Begin with one card, or unfold the year ahead."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {SPREADS.map((s) => (
          <SpreadCard key={s.slug} spread={s} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <GhostButton asChild>
          <Link href="/spreads">
            All spreads
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </GhostButton>
      </div>
    </SectionFrame>
  );
}

/* ────────────────── Living Grimoire teaser ────────────────── */

function GrimoireTeaser() {
  return (
    <SectionFrame
      kicker="Your living grimoire"
      title={<>The deck <span className="italic text-coven-soft-gold">remembers</span> with you</>}
      body="A private archive of every reading, every reflection, every recurring card. Yours and yours alone."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {MOCK_JOURNAL_ENTRIES.slice(0, 2).map((e) => (
            <JournalCard key={e.id} entry={e} />
          ))}
        </div>
        <div className="space-y-4">
          {MOCK_THEMES.slice(0, 2).map((t) => (
            <ThemeInsightCard
              key={t.theme}
              theme={t.theme}
              appearances={t.appearances}
              trend={t.trend}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <RitualButton asChild>
          <Link href="/journal">Enter the grimoire</Link>
        </RitualButton>
      </div>
    </SectionFrame>
  );
}

/* ────────────────── Footer ────────────────── */

function Footer() {
  return (
    <footer className="relative mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-12 pb-10">
        <div className="coven-divider mb-10" aria-hidden="true">
          <span className="text-coven-soft-gold/55 text-base">✦</span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoMark href="/" />
          <nav className="flex items-center gap-6 text-[0.7rem] tracking-[0.22em] uppercase text-coven-fog/75">
            <Link href="/about" className="hover:text-coven-soft-gold transition-colors">About</Link>
            <Link href="/journal" className="hover:text-coven-soft-gold transition-colors">Grimoire</Link>
            <Link href="/spreads" className="hover:text-coven-soft-gold transition-colors">Spreads</Link>
            <Link href="/about" className="hover:text-coven-soft-gold transition-colors">Privacy</Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-coven-fog/55 text-[0.68rem] tracking-[0.18em] leading-relaxed">
          For reflection, not prescription. TarotSnap is a contemplative tool.
          What the cards say is offered as mirror, never mandate.
        </p>
      </div>
    </footer>
  );
}

/**
 * Legacy export-compatibility hook (kept for downstream imports of
 * "useMounted" — analytics tooling sometimes references it).
 */
export function useMounted() {
  const [m, set] = useState(false);
  useEffect(() => set(true), []);
  return m;
}

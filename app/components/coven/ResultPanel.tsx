'use client';

import { motion } from 'framer-motion';
import { BookmarkPlus, MessageCircle } from 'lucide-react';
import RitualButton from './RitualButton';
import GhostButton from './GhostButton';
import TarotCardFront from './TarotCardFront';
import type { TarotCard } from '@/app/data/cards';

export interface ResultPanelData {
  card: Pick<TarotCard, 'name' | 'number' | 'arcana' | 'suit'>;
  tags: string[];
  reading: string;
  guidance?: string;
  energy?: string;
  timeframe?: string;
}

interface ResultPanelProps {
  data: ResultPanelData;
  onSave?: () => void;
  onFollowUp?: () => void;
  saveLabel?: string;
  followUpLabel?: string;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

/**
 * ResultPanel — the result page surface.
 * "YOUR CARD" kicker + framed TarotCardFront + name + tags + reading body
 * + Save/Follow-up button row + decorative star icons.
 */
export default function ResultPanel({
  data,
  onSave,
  onFollowUp,
  saveLabel = 'Save to Journal',
  followUpLabel = 'Ask a Follow-up',
}: ResultPanelProps) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl px-5 md:px-8 py-12"
    >
      <motion.div variants={item} className="text-center mb-8">
        <span className="coven-kicker">Your card</span>
      </motion.div>

      <motion.div
        variants={item}
        className="relative mx-auto mb-10 flex flex-col items-center"
      >
        {/* corner stars */}
        {[
          { cls: '-top-3 -left-2', d: 0 },
          { cls: '-top-3 -right-2', d: 0.2 },
          { cls: '-bottom-3 -left-2', d: 0.4 },
          { cls: '-bottom-3 -right-2', d: 0.6 },
        ].map((s, i) => (
          <span
            key={i}
            className={`absolute ${s.cls} text-coven-soft-gold/55 text-base`}
            aria-hidden="true"
          >
            ✦
          </span>
        ))}

        <div className="relative w-[260px] md:w-[300px]">
          <div className="absolute inset-0 -m-12 rounded-full bg-[radial-gradient(circle,rgba(122,69,165,0.45)_0%,transparent_70%)] blur-2xl pointer-events-none" />
          <TarotCardFront card={data.card} />
        </div>

        <h2 className="mt-7 font-serif text-[clamp(2rem,4vw,2.75rem)] text-coven-bone leading-tight tracking-tight text-center">
          {data.card.name}
        </h2>
        {data.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {data.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 text-[0.65rem] tracking-[0.22em] uppercase border border-[rgba(176,138,73,0.4)] text-coven-fog rounded-[1px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="coven-divider mb-8" aria-hidden="true">
        <span className="text-coven-soft-gold/65 text-base">✦</span>
      </motion.div>

      <motion.div
        variants={item}
        className="prose prose-invert max-w-none mb-10 text-center md:text-left"
      >
        <p className="font-serif text-[1.15rem] md:text-[1.2rem] text-coven-bone leading-[1.8] tracking-wide whitespace-pre-line">
          {data.reading}
        </p>
      </motion.div>

      {(data.guidance || data.energy || data.timeframe) && (
        <motion.div
          variants={item}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { k: 'Guidance', v: data.guidance },
            { k: 'Energy', v: data.energy },
            { k: 'Timeframe', v: data.timeframe },
          ]
            .filter((p) => p.v)
            .map((p) => (
              <div
                key={p.k}
                className="rounded-[3px] border border-[rgba(176,138,73,0.35)] bg-coven-ink/65 p-5"
              >
                <div className="coven-kicker text-[0.6rem] mb-2">{p.k}</div>
                <p className="text-sm text-coven-fog font-sans leading-relaxed">{p.v}</p>
              </div>
            ))}
        </motion.div>
      )}

      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <RitualButton size="md" onClick={onFollowUp}>
          <MessageCircle className="w-3.5 h-3.5" /> {followUpLabel}
        </RitualButton>
        <GhostButton onClick={onSave}>
          <BookmarkPlus className="w-3.5 h-3.5 mr-2" />
          {saveLabel}
        </GhostButton>
      </motion.div>
    </motion.section>
  );
}

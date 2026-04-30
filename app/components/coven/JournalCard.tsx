'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TarotCardFront from './TarotCardFront';
import type { TarotCard } from '@/app/data/cards';

export interface JournalEntry {
  id: string;
  card: Pick<TarotCard, 'name' | 'number' | 'arcana' | 'suit'>;
  date: string;
  question?: string;
  tags: string[];
}

interface JournalCardProps {
  entry: JournalEntry;
  className?: string;
  onClick?: () => void;
}

/**
 * JournalCard — mini tarot card thumb + card name + date + tag chips.
 */
export default function JournalCard({ entry, className, onClick }: JournalCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'group relative w-full rounded-[3px] overflow-hidden',
        'border border-[rgba(176,138,73,0.35)] hover:border-[rgba(216,182,106,0.7)]',
        'bg-gradient-to-b from-coven-ink/85 to-coven-plum/40',
        'transition-shadow duration-500 hover:shadow-coven-aura',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex gap-5 p-5">
        <div className="shrink-0 w-[88px]">
          <TarotCardFront card={entry.card} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="coven-kicker text-[0.6rem] mb-1">{entry.date}</span>
          <h4 className="font-serif text-xl text-coven-bone leading-snug mb-2">
            {entry.card.name}
          </h4>
          {entry.question && (
            <p className="text-sm text-coven-fog/85 italic font-sans line-clamp-2 mb-3">
              &ldquo;{entry.question}&rdquo;
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 text-[0.65rem] tracking-[0.2em] uppercase border border-[rgba(176,138,73,0.4)] text-coven-fog rounded-[1px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

'use client';

import { cn } from '@/lib/utils';

interface ThemeInsightCardProps {
  theme: string;
  appearances: number;
  trend?: 'rising' | 'stable' | 'fading';
  className?: string;
}

/**
 * ThemeInsightCard — plum surface with gold border, theme name,
 * appearance count, small sigil indicator.
 */
export default function ThemeInsightCard({
  theme,
  appearances,
  trend = 'stable',
  className,
}: ThemeInsightCardProps) {
  return (
    <article
      className={cn(
        'relative rounded-[3px] overflow-hidden p-5 md:p-6',
        'border border-[rgba(176,138,73,0.4)]',
        'bg-gradient-to-br from-coven-plum/55 via-coven-ink/80 to-coven-ink/95',
        'shadow-coven-deep',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="coven-kicker text-[0.6rem]">Recurring Theme</span>
        <SigilGlyph variant={trend} />
      </div>
      <h4 className="font-serif text-2xl text-coven-bone leading-tight mb-2">{theme}</h4>
      <div className="flex items-baseline gap-2 text-coven-fog">
        <span className="font-serif italic text-3xl text-coven-soft-gold">
          {appearances}
        </span>
        <span className="text-xs tracking-[0.2em] uppercase">
          appearance{appearances === 1 ? '' : 's'}
        </span>
      </div>
    </article>
  );
}

function SigilGlyph({ variant }: { variant: 'rising' | 'stable' | 'fading' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" className="text-coven-soft-gold/85" aria-hidden="true">
      <circle cx="11" cy="11" r="9" strokeWidth="0.7" />
      {variant === 'rising' && <path d="M11 16 L11 6 M7 9 L11 5 L15 9" strokeWidth="0.9" />}
      {variant === 'stable' && <path d="M5 11 L17 11 M5 14 L17 14" strokeWidth="0.7" opacity="0.8" />}
      {variant === 'fading' && <path d="M11 6 L11 16 M7 13 L11 17 L15 13" strokeWidth="0.9" />}
    </svg>
  );
}

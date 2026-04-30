'use client';

import { cn } from '@/lib/utils';

interface MoonPhaseTimelineProps {
  className?: string;
  /** 0-indexed; the month to highlight as "current" */
  currentMonthIndex?: number;
  /** Months to render. Defaults to last 8 months ending now. */
  months?: string[];
}

const DEFAULT_MONTHS = [
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
];

/**
 * MoonPhaseTimeline — horizontal row of moon-phase glyphs, one per month,
 * current month highlighted gold.
 */
export default function MoonPhaseTimeline({
  className,
  currentMonthIndex = DEFAULT_MONTHS.length - 1,
  months = DEFAULT_MONTHS,
}: MoonPhaseTimelineProps) {
  // Cycle through 8 phases keyed off month index for variety
  const phases = ['new', 'waxing-cres', 'first-q', 'waxing-gib', 'full', 'waning-gib', 'last-q', 'waning-cres'];

  return (
    <div
      className={cn(
        'relative w-full rounded-[3px] border border-[rgba(176,138,73,0.32)]',
        'bg-gradient-to-r from-coven-ink/70 via-coven-plum/30 to-coven-ink/70',
        'px-4 md:px-8 py-6 overflow-x-auto scrollbar-hide',
        className,
      )}
    >
      <div className="flex items-end justify-between gap-3 md:gap-6 min-w-[640px]">
        {months.map((m, i) => {
          const isCurrent = i === currentMonthIndex;
          const phase = phases[i % phases.length];
          return (
            <div key={`${m}-${i}`} className="flex flex-col items-center gap-2 min-w-0">
              <MoonGlyph phase={phase} highlighted={isCurrent} />
              <span
                className={cn(
                  'text-xs tracking-[0.25em] uppercase',
                  isCurrent ? 'text-coven-soft-gold' : 'text-coven-fog/70',
                )}
              >
                {m}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MoonGlyph({ phase, highlighted }: { phase: string; highlighted: boolean }) {
  const stroke = highlighted ? '#D8B66A' : 'rgba(191,174,220,0.55)';
  const fill = highlighted ? 'rgba(216,182,106,0.55)' : 'rgba(191,174,220,0.18)';

  const renderPhase = () => {
    switch (phase) {
      case 'new':
        return <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill="rgba(11,8,16,0.95)" />;
      case 'waxing-cres':
        return (
          <>
            <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill="rgba(11,8,16,0.95)" />
            <path d="M16 4 A 10 10 0 0 1 16 24 A 7 7 0 0 0 16 4 Z" fill={fill} />
          </>
        );
      case 'first-q':
        return (
          <>
            <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill="rgba(11,8,16,0.95)" />
            <path d="M14 4 A 10 10 0 0 1 14 24 Z" fill={fill} />
          </>
        );
      case 'waxing-gib':
        return (
          <>
            <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill={fill} />
            <path d="M10 4 A 10 10 0 0 0 10 24 A 6 6 0 0 1 10 4 Z" fill="rgba(11,8,16,0.95)" />
          </>
        );
      case 'full':
        return <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill={fill} />;
      case 'waning-gib':
        return (
          <>
            <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill={fill} />
            <path d="M18 4 A 10 10 0 0 1 18 24 A 6 6 0 0 0 18 4 Z" fill="rgba(11,8,16,0.95)" />
          </>
        );
      case 'last-q':
        return (
          <>
            <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill="rgba(11,8,16,0.95)" />
            <path d="M14 4 A 10 10 0 0 0 14 24 Z" fill={fill} />
          </>
        );
      case 'waning-cres':
        return (
          <>
            <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill="rgba(11,8,16,0.95)" />
            <path d="M12 4 A 10 10 0 0 0 12 24 A 7 7 0 0 1 12 4 Z" fill={fill} />
          </>
        );
      default:
        return <circle cx="14" cy="14" r="10" stroke={stroke} strokeWidth="0.9" fill={fill} />;
    }
  };

  return (
    <div className="relative">
      {highlighted && (
        <div className="absolute inset-0 -m-2 rounded-full bg-[radial-gradient(circle,rgba(216,182,106,0.35)_0%,transparent_70%)] blur-md" aria-hidden="true" />
      )}
      <svg width="28" height="28" viewBox="0 0 28 28" className="relative">
        {renderPhase()}
      </svg>
    </div>
  );
}

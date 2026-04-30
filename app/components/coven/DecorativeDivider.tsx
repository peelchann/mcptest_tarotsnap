import { cn } from '@/lib/utils';

interface DecorativeDividerProps {
  className?: string;
  symbol?: 'diamond' | 'star' | 'sigil';
}

/**
 * DecorativeDivider — thin gold line + central diamond/star sigil.
 * Used between major sections.
 */
export default function DecorativeDivider({
  className,
  symbol = 'diamond',
}: DecorativeDividerProps) {
  return (
    <div className={cn('flex items-center justify-center my-16 md:my-24', className)} aria-hidden="true">
      <div className="flex-1 max-w-[14rem] h-px bg-gradient-to-r from-transparent via-[rgba(176,138,73,0.5)] to-[rgba(216,182,106,0.55)]" />
      <div className="px-5">
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-coven-soft-gold"
        >
          {symbol === 'diamond' && (
            <>
              <path d="M21 4 L34 21 L21 38 L8 21 Z" />
              <path d="M21 11 L29 21 L21 31 L13 21 Z" strokeWidth="0.7" />
              <circle cx="21" cy="21" r="2" fill="currentColor" />
            </>
          )}
          {symbol === 'star' && (
            <>
              <path d="M21 5 L24 17 L36 17 L26 24 L30 36 L21 28 L12 36 L16 24 L6 17 L18 17 Z" />
              <circle cx="21" cy="21" r="1.5" fill="currentColor" />
            </>
          )}
          {symbol === 'sigil' && (
            <>
              <circle cx="21" cy="21" r="14" />
              <circle cx="21" cy="21" r="7" />
              <path d="M21 7 L21 35 M7 21 L35 21" strokeWidth="0.6" />
              <path d="M11 11 L31 31 M11 31 L31 11" strokeWidth="0.5" opacity="0.6" />
            </>
          )}
        </svg>
      </div>
      <div className="flex-1 max-w-[14rem] h-px bg-gradient-to-l from-transparent via-[rgba(176,138,73,0.5)] to-[rgba(216,182,106,0.55)]" />
    </div>
  );
}

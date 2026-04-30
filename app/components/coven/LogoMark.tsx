import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoMarkProps {
  className?: string;
  href?: string;
  showSigil?: boolean;
}

/**
 * LogoMark — small sun/moon sigil + "TAROTSNAP" wordmark.
 * Rendered in gold against any backdrop.
 */
export default function LogoMark({
  className,
  href = '/',
  showSigil = true,
}: LogoMarkProps) {
  const inner = (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 select-none',
        className,
      )}
    >
      {showSigil && (
        <svg
          viewBox="0 0 32 32"
          width="22"
          height="22"
          className="text-coven-soft-gold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="6.5" />
          <path d="M16 4 L16 28 M4 16 L28 16" strokeWidth="0.6" />
          {/* sun rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = 16 + Math.cos(angle) * 12;
            const y1 = 16 + Math.sin(angle) * 12;
            const x2 = 16 + Math.cos(angle) * 14.5;
            const y2 = 16 + Math.sin(angle) * 14.5;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.8" />
            );
          })}
          {/* crescent moon overlay */}
          <path
            d="M19 11 A 6 6 0 1 0 19 21 A 4 4 0 1 1 19 11 Z"
            fill="currentColor"
            opacity="0.85"
          />
          <circle cx="16" cy="16" r="1.2" fill="currentColor" />
        </svg>
      )}
      <span
        className="font-sans text-[0.78rem] font-medium tracking-[0.32em] uppercase text-coven-soft-gold"
        style={{ fontFeatureSettings: '"smcp" on' }}
      >
        TAROTSNAP
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link
      href={href}
      className="inline-flex items-center transition-opacity hover:opacity-90"
      aria-label="TarotSnap home"
    >
      {inner}
    </Link>
  );
}

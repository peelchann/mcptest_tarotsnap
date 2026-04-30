import { cn } from '@/lib/utils';
import TarotCardSurface from './TarotCardSurface';

interface TarotCardBackProps {
  className?: string;
  width?: number;
}

/**
 * TarotCardBack — the iconic card back. Deep plum, ornate gold linework
 * frame, central moon-phase + sun rays sigil, four corner stars,
 * subtle hatch pattern fill behind.
 */
export default function TarotCardBack({ className, width }: TarotCardBackProps) {
  return (
    <TarotCardSurface className={cn(className)} width={width} innerRing={false}>
      <div className="card-back-pattern absolute inset-0" />

      <svg
        viewBox="0 0 100 160"
        className="absolute inset-0 w-full h-full text-coven-soft-gold"
        fill="none"
        stroke="currentColor"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* outer double ornamental rule */}
        <rect x="4" y="4" width="92" height="152" strokeWidth="0.8" />
        <rect x="6.5" y="6.5" width="87" height="147" strokeWidth="0.4" opacity="0.7" />
        <rect x="9" y="9" width="82" height="142" strokeWidth="0.25" opacity="0.5" />

        {/* corner flourishes */}
        {[
          [9, 9, 1, 1],
          [91, 9, -1, 1],
          [9, 151, 1, -1],
          [91, 151, -1, -1],
        ].map(([cx, cy, fx, fy], i) => (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${fx} ${fy})`}>
            <path d="M0 0 L8 0 M0 0 L0 8" strokeWidth="0.6" />
            <path d="M2 2 L6 2 M2 2 L2 6" strokeWidth="0.4" opacity="0.7" />
            <circle cx="2" cy="2" r="0.7" fill="currentColor" />
          </g>
        ))}

        {/* central panel */}
        <g transform="translate(50 80)">
          {/* outer halo ring */}
          <circle cx="0" cy="0" r="32" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="28" strokeWidth="0.3" opacity="0.6" />

          {/* sun rays */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * Math.PI) / 8;
            const r1 = 18.5;
            const r2 = i % 2 === 0 ? 27 : 24.5;
            const x1 = Math.cos(a) * r1;
            const y1 = Math.sin(a) * r1;
            const x2 = Math.cos(a) * r2;
            const y2 = Math.sin(a) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.55" />;
          })}

          {/* moon-phase: full circle with crescent overlay */}
          <circle cx="0" cy="0" r="14" strokeWidth="0.7" />
          <circle cx="0" cy="0" r="11" strokeWidth="0.35" opacity="0.55" />
          <path
            d="M3 -10 A 10 10 0 1 0 3 10 A 7 7 0 1 1 3 -10 Z"
            fill="currentColor"
            opacity="0.78"
            stroke="none"
          />
          <circle cx="0" cy="0" r="1.4" fill="currentColor" stroke="none" />

          {/* small ornament dots */}
          {Array.from({ length: 4 }).map((_, i) => {
            const a = (i * Math.PI) / 2 + Math.PI / 4;
            const cx = Math.cos(a) * 32;
            const cy = Math.sin(a) * 32;
            return <circle key={i} cx={cx} cy={cy} r="0.9" fill="currentColor" stroke="none" />;
          })}
        </g>

        {/* upper crest */}
        <g transform="translate(50 24)">
          <path d="M-12 0 L0 -7 L12 0 L0 7 Z" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="1.6" fill="currentColor" stroke="none" />
        </g>

        {/* lower crest */}
        <g transform="translate(50 136)">
          <path d="M-12 0 L0 -7 L12 0 L0 7 Z" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="1.6" fill="currentColor" stroke="none" />
        </g>

        {/* small four stars in corners (above frame) */}
        {[
          [16, 18],
          [84, 18],
          [16, 142],
          [84, 142],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <path
              d="M0 -3 L0.7 -0.7 L3 0 L0.7 0.7 L0 3 L-0.7 0.7 L-3 0 L-0.7 -0.7 Z"
              fill="currentColor"
              stroke="none"
            />
          </g>
        ))}
      </svg>
    </TarotCardSurface>
  );
}

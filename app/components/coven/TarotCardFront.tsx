import { cn } from '@/lib/utils';
import TarotCardSurface from './TarotCardSurface';
import type { TarotCard } from '@/app/data/cards';

interface TarotCardFrontProps {
  card: Pick<TarotCard, 'name' | 'number' | 'arcana' | 'suit'>;
  className?: string;
  width?: number;
}

/**
 * TarotCardFront — generic illustrated front for any card.
 * Gold roman-numeral header, central illustrative SVG (varies per card),
 * card name in serif at base, gold inner double-rule.
 */
export default function TarotCardFront({
  card,
  className,
  width,
}: TarotCardFrontProps) {
  return (
    <TarotCardSurface className={cn(className)} width={width}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(122,69,165,0.32)_0%,rgba(11,8,16,0.95)_75%)]" />

      <svg
        viewBox="0 0 100 160"
        className="absolute inset-0 w-full h-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* inner double rule */}
        <g className="text-coven-soft-gold" stroke="currentColor">
          <rect x="6" y="6" width="88" height="148" strokeWidth="0.7" />
          <rect x="9" y="9" width="82" height="142" strokeWidth="0.3" opacity="0.65" />
        </g>

        {/* roman numeral plate */}
        <g transform="translate(50 22)">
          <rect
            x="-15"
            y="-9"
            width="30"
            height="18"
            stroke="rgba(216,182,106,0.55)"
            strokeWidth="0.5"
            fill="rgba(11,8,16,0.5)"
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="11"
            fill="#D8B66A"
            letterSpacing="2"
          >
            {romanize(card.number)}
          </text>
        </g>

        {/* central illustrative symbol */}
        <g transform="translate(50 86)">
          <CardSymbol card={card} />
        </g>

        {/* card name plate at base */}
        <g transform="translate(50 142)">
          <line x1="-30" y1="-8" x2="30" y2="-8" stroke="rgba(216,182,106,0.45)" strokeWidth="0.4" />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="6.4"
            fontStyle="italic"
            fill="#EAE2D2"
            letterSpacing="1.5"
          >
            {card.name}
          </text>
        </g>
      </svg>
    </TarotCardSurface>
  );
}

function romanize(num: number | string): string {
  if (typeof num !== 'number') return String(num);
  const map: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  if (num === 0) return '0';
  let n = num;
  let out = '';
  while (n > 0) {
    for (const [v, s] of map) {
      if (n >= v) {
        out += s;
        n -= v;
        break;
      }
    }
  }
  // For 11+ via I+X repetition:
  if (num >= 11) {
    out = '';
    let r = num;
    const big: Array<[number, string]> = [
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    while (r > 0) {
      for (const [v, s] of big) {
        if (r >= v) {
          out += s;
          r -= v;
          break;
        }
      }
    }
  }
  return out;
}

/** CardSymbol — simple, stylized SVG glyph chosen by card identity. */
function CardSymbol({
  card,
}: {
  card: Pick<TarotCard, 'name' | 'number' | 'arcana' | 'suit'>;
}) {
  const name = card.name.toLowerCase();
  const stroke = '#D8B66A';
  const fill = 'rgba(216,182,106,0.18)';

  // Disambiguate by name keyword
  if (name.includes('moon')) {
    return (
      <g stroke={stroke} fill="none">
        <circle r="22" strokeWidth="0.6" opacity="0.6" />
        <path
          d="M6 -18 A 18 18 0 1 0 6 18 A 13 13 0 1 1 6 -18 Z"
          fill={fill}
          strokeWidth="1"
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 22}
              y1={Math.sin(a) * 22}
              x2={Math.cos(a) * 27}
              y2={Math.sin(a) * 27}
              strokeWidth="0.5"
            />
          );
        })}
      </g>
    );
  }
  if (name.includes('sun')) {
    return (
      <g stroke={stroke} fill="none">
        <circle r="14" fill={fill} strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 16}
              y1={Math.sin(a) * 16}
              x2={Math.cos(a) * (i % 2 === 0 ? 28 : 24)}
              y2={Math.sin(a) * (i % 2 === 0 ? 28 : 24)}
              strokeWidth={i % 2 === 0 ? 0.9 : 0.6}
            />
          );
        })}
        <circle r="6" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('star')) {
    return (
      <g stroke={stroke} fill="none">
        <path
          d="M0 -22 L6 -7 L22 -5 L9 5 L13 22 L0 13 L-13 22 L-9 5 L-22 -5 L-6 -7 Z"
          fill={fill}
          strokeWidth="0.9"
        />
        <circle r="2" fill={stroke} stroke="none" />
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          return (
            <circle
              key={i}
              cx={Math.cos(a) * 27}
              cy={Math.sin(a) * 27}
              r="0.9"
              fill={stroke}
              stroke="none"
            />
          );
        })}
      </g>
    );
  }
  if (name.includes('high priestess')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-14 -22 L14 -22 L14 22 L-14 22 Z" strokeWidth="0.6" opacity="0.5" />
        <path d="M0 -18 L0 18" strokeWidth="0.5" />
        <circle r="6" cy="-6" fill={fill} strokeWidth="0.9" />
        <path d="M-3 -6 L3 -6 M0 -3 L0 -9" strokeWidth="0.5" />
        <path d="M-10 4 L-10 18 L10 18 L10 4" strokeWidth="0.7" />
        {/* veil pattern */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={-9 + i * 4.5}
            y1="6"
            x2={-9 + i * 4.5}
            y2="17"
            strokeWidth="0.3"
            opacity="0.5"
          />
        ))}
      </g>
    );
  }
  if (name.includes('death')) {
    return (
      <g stroke={stroke} fill="none">
        <path
          d="M-9 -16 L9 -16 L13 -8 L9 0 L9 18 L-9 18 L-9 0 L-13 -8 Z"
          fill={fill}
          strokeWidth="0.8"
        />
        <circle cx="-3.5" cy="-7" r="1.4" fill={stroke} stroke="none" />
        <circle cx="3.5" cy="-7" r="1.4" fill={stroke} stroke="none" />
        <path d="M-4 -1 L4 -1" strokeWidth="0.6" />
        <path d="M-2 2 L-2 6 M0 2 L0 6 M2 2 L2 6" strokeWidth="0.5" />
        {/* scythe */}
        <path d="M14 -22 L18 22" strokeWidth="0.7" />
        <path d="M14 -22 Q24 -18 22 -10" strokeWidth="0.7" />
      </g>
    );
  }
  if (name.includes('emperor')) {
    return (
      <g stroke={stroke} fill="none">
        <path
          d="M-14 22 L-14 -10 Q0 -22 14 -10 L14 22 Z"
          strokeWidth="0.7"
          fill={fill}
        />
        {/* crown */}
        <path d="M-7 -16 L-5 -22 L-3 -17 L0 -23 L3 -17 L5 -22 L7 -16" strokeWidth="0.6" />
        <circle cy="-9" r="3" strokeWidth="0.5" />
        <path d="M-8 0 L8 0" strokeWidth="0.5" />
        <path d="M-9 8 L9 8" strokeWidth="0.4" opacity="0.6" />
      </g>
    );
  }
  if (name.includes('lovers')) {
    return (
      <g stroke={stroke} fill="none">
        <circle cx="-7" cy="-2" r="5" strokeWidth="0.7" />
        <path d="M-12 18 L-12 4 Q-12 0 -7 0 Q-2 0 -2 4 L-2 18 Z" strokeWidth="0.5" fill={fill} />
        <circle cx="7" cy="-2" r="5" strokeWidth="0.7" />
        <path d="M2 18 L2 4 Q2 0 7 0 Q12 0 12 4 L12 18 Z" strokeWidth="0.5" fill={fill} />
        <path
          d="M0 -16 Q-3 -19 -5 -16 Q-5 -13 0 -10 Q5 -13 5 -16 Q3 -19 0 -16 Z"
          fill={stroke}
          stroke="none"
          opacity="0.85"
        />
      </g>
    );
  }
  if (name.includes('tower')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-9 22 L-9 -16 L9 -16 L9 22 Z" strokeWidth="0.8" fill={fill} />
        <path d="M-9 -16 L0 -24 L9 -16" strokeWidth="0.7" />
        <path d="M-6 -8 L6 -8 M-6 0 L6 0 M-6 8 L6 8" strokeWidth="0.4" />
        <path d="M-15 -22 L-9 -16 M15 -22 L9 -16" strokeWidth="0.5" opacity="0.6" />
        {/* lightning */}
        <path d="M-2 -22 L2 -10 L-2 -10 L4 6" strokeWidth="0.9" />
      </g>
    );
  }
  if (name.includes('wheel')) {
    return (
      <g stroke={stroke} fill="none">
        <circle r="22" strokeWidth="0.9" />
        <circle r="14" strokeWidth="0.5" opacity="0.6" />
        <circle r="4" fill={fill} strokeWidth="0.6" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 4}
              y1={Math.sin(a) * 4}
              x2={Math.cos(a) * 22}
              y2={Math.sin(a) * 22}
              strokeWidth="0.55"
            />
          );
        })}
      </g>
    );
  }
  if (name.includes('hermit')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-10 22 L0 -22 L10 22 Z" strokeWidth="0.7" fill={fill} />
        {/* lantern */}
        <path d="M-3 -8 L3 -8 L3 -2 L-3 -2 Z" strokeWidth="0.5" />
        <circle cx="0" cy="-5" r="2" fill={stroke} stroke="none" />
        <path d="M0 -10 L0 -8" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('cup')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-12 -10 Q0 0 12 -10 L10 -2 Q0 6 -10 -2 Z" strokeWidth="0.7" fill={fill} />
        <path d="M-2 6 L-2 18 L-9 22 L9 22 L2 18 L2 6" strokeWidth="0.7" />
        <circle cy="-12" r="2" fill={stroke} stroke="none" />
      </g>
    );
  }
  if (name.includes('sword')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M0 -22 L0 16" strokeWidth="1.1" />
        <path d="M-3 -22 L3 -22" strokeWidth="0.9" />
        <path d="M-9 14 L9 14" strokeWidth="0.9" />
        <circle cy="20" r="3" fill={fill} strokeWidth="0.7" />
      </g>
    );
  }
  if (name.includes('wand')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-16 18 L18 -16" strokeWidth="0.9" />
        <path d="M14 -20 L22 -12 L18 -16 Z" fill={stroke} stroke="none" />
        <path d="M-18 16 L-12 22" strokeWidth="0.7" />
        {/* leaf */}
        <path d="M2 0 Q-4 -6 -10 -2 Q-4 0 0 6 Q6 0 2 0 Z" fill={fill} strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('pentacle')) {
    return (
      <g stroke={stroke} fill="none">
        <circle r="20" fill={fill} strokeWidth="0.9" />
        <path
          d="M0 -16 L4.7 -5 L16 -5 L7 1.5 L11 13 L0 6 L-11 13 L-7 1.5 L-16 -5 L-4.7 -5 Z"
          strokeWidth="0.7"
        />
      </g>
    );
  }
  if (name.includes('justice')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M0 -20 L0 18" strokeWidth="0.9" />
        <path d="M-14 -10 L14 -10" strokeWidth="0.7" />
        <path d="M-14 -10 L-18 4 L-10 4 Z" strokeWidth="0.7" fill={fill} />
        <path d="M14 -10 L18 4 L10 4 Z" strokeWidth="0.7" fill={fill} />
        <circle cy="-18" r="2.5" fill={stroke} stroke="none" />
      </g>
    );
  }
  if (name.includes('hanged')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-16 -22 L16 -22" strokeWidth="0.6" />
        <path d="M0 -22 L0 -10" strokeWidth="0.6" />
        <path d="M-7 -10 L0 -2 L7 -10 Z" strokeWidth="0.7" fill={fill} />
        <path d="M0 -2 L0 14" strokeWidth="0.6" />
        <path d="M-6 18 L0 14 L6 22" strokeWidth="0.6" />
      </g>
    );
  }
  if (name.includes('chariot')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-14 12 L14 12 L18 0 L-18 0 Z" strokeWidth="0.7" fill={fill} />
        <circle cx="-12" cy="14" r="4" strokeWidth="0.6" />
        <circle cx="12" cy="14" r="4" strokeWidth="0.6" />
        <path d="M-9 0 L-9 -10 L9 -10 L9 0" strokeWidth="0.7" />
        <path d="M0 -10 L0 -22 M-3 -22 L3 -22" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('hierophant')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-12 22 L-12 -8 L12 -8 L12 22 Z" strokeWidth="0.7" fill={fill} />
        <path d="M-6 -8 L-6 -22 L6 -22 L6 -8" strokeWidth="0.5" />
        <path d="M0 -22 L0 -2" strokeWidth="0.5" />
        <path d="M-3 -16 L3 -16" strokeWidth="0.5" />
        <path d="M-3 -10 L3 -10" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('strength')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-14 6 Q-14 -10 0 -10 Q14 -10 14 6" strokeWidth="0.8" fill={fill} />
        <path d="M-8 14 L-8 6 L8 6 L8 14" strokeWidth="0.6" />
        <circle cy="-2" r="6" strokeWidth="0.7" />
        <path d="M-8 -14 Q-2 -22 0 -14 Q2 -22 8 -14" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('temperance')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-12 -8 Q-8 -16 0 -16 Q8 -16 12 -8 Z" strokeWidth="0.6" fill={fill} />
        <path d="M-8 -2 L-8 18 L8 18 L8 -2" strokeWidth="0.7" />
        {/* flowing water */}
        <path d="M-3 0 Q-1 4 -3 8 Q-1 12 -3 16" strokeWidth="0.5" />
        <path d="M3 0 Q5 4 3 8 Q5 12 3 16" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('devil')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-10 -8 L-14 -22 M10 -8 L14 -22" strokeWidth="0.8" />
        <path d="M-12 8 Q-12 -8 0 -8 Q12 -8 12 8 Z" strokeWidth="0.7" fill={fill} />
        <circle cx="-5" cy="-2" r="1.5" fill={stroke} stroke="none" />
        <circle cx="5" cy="-2" r="1.5" fill={stroke} stroke="none" />
        <path d="M-3 4 L0 8 L3 4" strokeWidth="0.5" />
        <path d="M0 8 L0 22" strokeWidth="0.5" />
      </g>
    );
  }
  if (name.includes('judgement')) {
    return (
      <g stroke={stroke} fill="none">
        <path
          d="M-22 -14 Q-14 -22 0 -18 Q14 -22 22 -14"
          strokeWidth="0.7"
        />
        <path d="M-3 -10 L0 -16 L3 -10 Z" strokeWidth="0.5" fill={fill} />
        <path d="M-9 6 L-9 18 L9 18 L9 6" strokeWidth="0.7" fill={fill} />
        <circle cy="0" r="4" strokeWidth="0.6" />
      </g>
    );
  }
  if (name.includes('world')) {
    return (
      <g stroke={stroke} fill="none">
        <ellipse rx="14" ry="20" strokeWidth="0.7" fill={fill} />
        {Array.from({ length: 4 }).map((_, i) => {
          const a = (i * Math.PI) / 2;
          return (
            <circle
              key={i}
              cx={Math.cos(a) * 22}
              cy={Math.sin(a) * 22}
              r="2.4"
              fill={stroke}
              stroke="none"
            />
          );
        })}
      </g>
    );
  }
  if (name.includes('fool')) {
    return (
      <g stroke={stroke} fill="none">
        <circle cy="-12" r="5" strokeWidth="0.7" />
        <path d="M-7 18 L-7 0 Q-7 -4 0 -4 Q7 -4 7 0 L7 18 Z" strokeWidth="0.7" fill={fill} />
        <path d="M-12 14 L7 -4" strokeWidth="0.5" />
        <circle cx="-12" cy="14" r="2.5" fill={stroke} stroke="none" />
        {/* sun behind */}
        <circle cy="-16" r="14" strokeWidth="0.3" opacity="0.4" />
      </g>
    );
  }
  if (name.includes('magician')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-9 -22 L9 -22" strokeWidth="0.5" />
        <path d="M0 -22 L0 -8" strokeWidth="0.7" />
        <circle cy="0" r="3" fill={stroke} stroke="none" />
        <path d="M-12 8 L-12 18 L12 18 L12 8 Z" strokeWidth="0.7" fill={fill} />
        {/* infinity above head */}
        <path
          d="M-7 -16 Q-3 -19 0 -16 Q3 -13 7 -16 Q3 -19 0 -16 Q-3 -13 -7 -16 Z"
          strokeWidth="0.5"
        />
      </g>
    );
  }
  if (name.includes('empress')) {
    return (
      <g stroke={stroke} fill="none">
        <path d="M-14 22 L-14 -2 Q-14 -10 0 -10 Q14 -10 14 -2 L14 22 Z" strokeWidth="0.7" fill={fill} />
        <circle cy="-14" r="5" strokeWidth="0.7" />
        <path d="M-3 -16 L0 -22 L3 -16" strokeWidth="0.5" />
        {/* heart shield */}
        <path d="M-3 4 Q-6 0 -3 -2 Q0 0 0 4 Q0 0 3 -2 Q6 0 3 4 L0 8 Z" fill={stroke} stroke="none" />
      </g>
    );
  }

  // Default: circle + sigil
  return (
    <g stroke={stroke} fill="none">
      <circle r="22" strokeWidth="0.7" fill={fill} />
      <path d="M0 -22 L0 22 M-22 0 L22 0" strokeWidth="0.4" opacity="0.55" />
      <circle r="11" strokeWidth="0.4" opacity="0.7" />
      <path
        d="M0 -8 L2.4 -2.5 L8 -2.5 L3.5 1 L5 6.5 L0 3 L-5 6.5 L-3.5 1 L-8 -2.5 L-2.4 -2.5 Z"
        fill={stroke}
        stroke="none"
        opacity="0.85"
      />
    </g>
  );
}

import { cn } from '@/lib/utils';

interface LoadingSigilProps {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * LoadingSigil — rotating SVG octagram + slow opacity pulse.
 * "The cards are listening…" framer for the draw step.
 */
export default function LoadingSigil({
  size = 96,
  className,
  label,
}: LoadingSigilProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-5', className)}
      role="status"
      aria-label={label || 'Loading'}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(122,69,165,0.45)_0%,transparent_70%)] blur-xl" />
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="sigil-loader relative"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        >
          <g className="text-coven-soft-gold" stroke="currentColor">
            <circle cx="50" cy="50" r="46" />
            <circle cx="50" cy="50" r="36" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="20" />
            <path d="M50 8 L92 50 L50 92 L8 50 Z" />
            <path d="M22 22 L78 78 M22 78 L78 22" strokeWidth="0.7" />
            <path d="M50 8 L50 92 M8 50 L92 50" strokeWidth="0.6" />
            {/* corner stars */}
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              const cx = 50 + Math.cos(a) * 46;
              const cy = 50 + Math.sin(a) * 46;
              return (
                <circle key={i} cx={cx} cy={cy} r="1.6" fill="currentColor" />
              );
            })}
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </g>
        </svg>
      </div>
      {label && (
        <p className="font-serif italic text-coven-fog text-lg tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
}

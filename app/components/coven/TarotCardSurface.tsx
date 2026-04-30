import { cn } from '@/lib/utils';

interface TarotCardSurfaceProps {
  children?: React.ReactNode;
  className?: string;
  /** width in px — height auto-derives from 0.62 aspect (5:8). */
  width?: number;
  /** ring inside the gold frame (a second hairline) */
  innerRing?: boolean;
}

/**
 * TarotCardSurface — base container for tarot-card visuals.
 * Gold ornamental border + deep plum gradient + optional inner ring.
 * Aspect ratio 0.62 (5:8 — classic tarot).
 */
export default function TarotCardSurface({
  children,
  className,
  width,
  innerRing = true,
}: TarotCardSurfaceProps) {
  return (
    <div
      className={cn('relative gold-frame rounded-[3px] overflow-hidden', className)}
      style={{
        aspectRatio: '5 / 8',
        width: width ? `${width}px` : undefined,
      }}
    >
      {innerRing && (
        <div
          className="pointer-events-none absolute inset-[10px] border border-[rgba(216,182,106,0.32)] rounded-[2px]"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

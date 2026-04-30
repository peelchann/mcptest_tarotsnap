import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuotaPillProps {
  used?: number;
  remaining: number;
  total?: number;
  label?: string;
  className?: string;
}

/**
 * QuotaPill — tiny rounded pill: sparkle + "Readings: 2 / 3 today".
 */
export default function QuotaPill({
  used,
  remaining,
  total = 3,
  label = 'Readings today',
  className,
}: QuotaPillProps) {
  const usedActual = used ?? Math.max(0, total - remaining);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full',
        'foil-border text-coven-fog text-[0.7rem] tracking-[0.22em] uppercase',
        className,
      )}
    >
      <Sparkles className="w-3 h-3 text-coven-soft-gold" strokeWidth={1.6} />
      <span>{label}</span>
      <span className="text-coven-soft-gold font-medium">
        {usedActual}/{total}
      </span>
    </span>
  );
}

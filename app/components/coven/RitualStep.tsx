'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RitualStepProps {
  step: number;
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
}

/**
 * RitualStep — circular gold-bordered icon + step number kicker +
 * serif title + body. Chained with arrows on desktop (rendered by parent).
 */
export default function RitualStep({
  step,
  icon: Icon,
  title,
  body,
  className,
}: RitualStepProps) {
  return (
    <div className={cn('flex flex-col items-center text-center max-w-[16rem] mx-auto', className)}>
      <div className="relative mb-5">
        <div className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(122,69,165,0.32)_0%,transparent_70%)] blur-xl" aria-hidden="true" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-[rgba(216,182,106,0.55)] bg-[radial-gradient(circle,rgba(36,18,47,0.95)_0%,rgba(11,8,16,0.95)_75%)] shadow-[inset_0_0_22px_rgba(122,69,165,0.32),0_0_0_1px_rgba(216,182,106,0.18)]">
          <Icon className="w-7 h-7 text-coven-soft-gold" strokeWidth={1.3} />
          {/* tiny halo dots */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const cx = 40 + Math.cos(a) * 38;
            const cy = 40 + Math.sin(a) * 38;
            return (
              <span
                key={i}
                className="absolute w-1 h-1 rounded-full bg-coven-soft-gold/55"
                style={{ left: cx - 2, top: cy - 2 }}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>

      <span className="coven-kicker mb-2 text-[0.62rem]">
        Step {String(step).padStart(2, '0')}
      </span>
      <h4 className="font-serif text-2xl text-coven-bone mb-3 leading-tight">
        {title}
      </h4>
      <p className="text-sm text-coven-fog font-sans font-light leading-relaxed">
        {body}
      </p>
    </div>
  );
}

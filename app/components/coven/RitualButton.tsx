'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RitualButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSparkle?: boolean;
  iconRight?: React.ReactNode;
}

/**
 * RitualButton — the primary CTA.
 * Dark plum gradient body, gold border, gentle inner purple aura,
 * sparkle prefix, gold shimmer sweep on hover. Press scale 0.98.
 * Supports asChild (Radix Slot) so it can wrap a Next <Link>.
 */
const RitualButton = React.forwardRef<HTMLButtonElement, RitualButtonProps>(
  (
    {
      className,
      asChild = false,
      size = 'md',
      children,
      showSparkle = true,
      iconRight,
      ...props
    },
    ref,
  ) => {
    const Comp = (asChild ? Slot : 'button') as 'button';
    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-9 py-4 text-base',
    }[size];

    return (
      <Comp
        ref={ref}
        className={cn(
          'shimmer-button group relative inline-flex items-center justify-center gap-2.5',
          'rounded-[2px] tracking-[0.18em] uppercase font-medium',
          'border border-[rgba(216,182,106,0.55)] text-coven-soft-gold',
          'bg-gradient-to-b from-[#2A1638] via-[#1F0F2A] to-[#160A1F]',
          'shadow-[inset_0_1px_0_rgba(216,182,106,0.18),0_2px_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(176,138,73,0.0)]',
          'transition-all duration-300 ease-out',
          'hover:border-[rgba(216,182,106,0.85)] hover:text-coven-bone',
          'hover:shadow-[inset_0_1px_0_rgba(216,182,106,0.32),0_2px_0_rgba(0,0,0,0.4),0_0_28px_rgba(122,69,165,0.45)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-soft-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-coven-deep',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[rgba(216,182,106,0.55)]',
          sizeStyles,
          className,
        )}
        {...(asChild ? {} : { type: props.type ?? 'button' })}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <span className="relative z-[2] inline-flex items-center gap-2.5">
            {showSparkle && (
              <Sparkles
                className="h-3.5 w-3.5 opacity-80 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />
            )}
            <span>{children}</span>
            {iconRight}
          </span>
        )}
      </Comp>
    );
  },
);
RitualButton.displayName = 'RitualButton';

export default RitualButton;

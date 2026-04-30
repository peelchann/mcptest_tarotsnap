'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface GhostButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
}

/**
 * GhostButton — secondary CTA. Transparent body, gold-rest border, fog-lavender text.
 */
const GhostButton = React.forwardRef<HTMLButtonElement, GhostButtonProps>(
  (
    { className, asChild = false, size = 'md', children, iconLeft, ...props },
    ref,
  ) => {
    const Comp = (asChild ? Slot : 'button') as 'button';
    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-3.5 text-sm',
    }[size];

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-[2px] tracking-[0.2em] uppercase font-medium',
          'border border-[rgba(176,138,73,0.45)] text-coven-fog',
          'bg-transparent backdrop-blur-sm',
          'transition-all duration-300 ease-out',
          'hover:border-[rgba(216,182,106,0.7)] hover:text-coven-bone hover:bg-coven-ink/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-soft-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-coven-deep',
          'active:scale-[0.98]',
          sizeStyles,
          className,
        )}
        {...(asChild ? {} : { type: props.type ?? 'button' })}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {iconLeft}
            <span>{children}</span>
          </>
        )}
      </Comp>
    );
  },
);
GhostButton.displayName = 'GhostButton';

export default GhostButton;

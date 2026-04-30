'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface QuestionTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  label?: string;
}

/**
 * QuestionTextarea — dark plum surface, gold border, fog-lavender placeholder,
 * char count bottom-right, focus gold glow.
 */
const QuestionTextarea = React.forwardRef<HTMLTextAreaElement, QuestionTextareaProps>(
  ({ value, onChange, maxLength = 500, label, className, ...rest }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="coven-kicker block text-left">{label}</label>
        )}
        <div
          className={cn(
            'relative rounded-[3px]',
            'border border-[rgba(176,138,73,0.45)]',
            'bg-coven-ink/85 backdrop-blur-md',
            'shadow-[inset_0_0_24px_rgba(36,18,47,0.6)]',
            'transition-all duration-300',
            'focus-within:border-[rgba(216,182,106,0.85)] focus-within:shadow-[inset_0_0_24px_rgba(36,18,47,0.6),0_0_24px_rgba(216,182,106,0.18)]',
            className,
          )}
        >
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            className="block w-full min-h-[140px] resize-none bg-transparent border-0 outline-none text-coven-bone font-serif italic text-lg leading-relaxed placeholder:text-coven-fog/55 placeholder:italic px-5 pt-5 pb-10 focus:ring-0"
            {...rest}
          />
          <div className="absolute bottom-2 right-3 text-[0.65rem] tracking-[0.2em] uppercase text-coven-fog/60">
            {value.length}/{maxLength}
          </div>
        </div>
      </div>
    );
  },
);
QuestionTextarea.displayName = 'QuestionTextarea';

export default QuestionTextarea;

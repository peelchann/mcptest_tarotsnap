import { cn } from '@/lib/utils';

interface SectionFrameProps {
  kicker?: string;
  title?: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  align?: 'center' | 'left';
  decorative?: boolean;
  id?: string;
}

/**
 * SectionFrame — max-w container with optional kicker label + serif title +
 * intro paragraph. Used by every major homepage section and inner-page hero.
 */
export default function SectionFrame({
  kicker,
  title,
  body,
  children,
  className,
  align = 'center',
  decorative = false,
  id,
}: SectionFrameProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative mx-auto w-full max-w-7xl px-5 md:px-8',
        className,
      )}
    >
      {(kicker || title || body) && (
        <header
          className={cn(
            'mb-10 md:mb-14',
            align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left',
          )}
        >
          {kicker && (
            <div
              className={cn(
                'mb-5 inline-flex items-center gap-3',
                align === 'center' && 'justify-center',
              )}
            >
              {decorative && (
                <span className="hidden md:inline-block w-10 h-px bg-gradient-to-r from-transparent to-[rgba(216,182,106,0.6)]" />
              )}
              <span className="coven-kicker">{kicker}</span>
              {decorative && (
                <span className="hidden md:inline-block w-10 h-px bg-gradient-to-l from-transparent to-[rgba(216,182,106,0.6)]" />
              )}
            </div>
          )}
          {title && (
            <h2 className="font-serif text-coven-bone text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-tight">
              {title}
            </h2>
          )}
          {body && (
            <p className="mt-5 text-coven-fog text-base md:text-lg leading-relaxed font-sans font-light max-w-2xl mx-auto">
              {body}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

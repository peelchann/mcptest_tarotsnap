import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/**
 * InsightCard — right-rail panel for the journal page.
 * Plum surface, gold border, eye sigil, body copy, "View All Insights" link.
 */
export default function InsightCard({
  title = 'Your Pattern',
  body,
  ctaLabel = 'View All Insights',
  ctaHref = '#insights',
  className,
}: InsightCardProps) {
  return (
    <aside
      className={cn(
        'relative rounded-[3px] overflow-hidden p-6 md:p-7',
        'border border-[rgba(176,138,73,0.4)]',
        'bg-gradient-to-br from-coven-plum/55 via-coven-ink/85 to-coven-ink/95',
        'shadow-coven-deep',
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[rgba(216,182,106,0.55)] bg-[radial-gradient(circle,rgba(122,69,165,0.4)_0%,rgba(11,8,16,0.95)_75%)]">
          <Eye className="w-4 h-4 text-coven-soft-gold" strokeWidth={1.4} />
        </span>
        <span className="coven-kicker text-[0.62rem]">{title}</span>
      </div>

      <p className="font-serif italic text-[1.05rem] text-coven-bone leading-relaxed mb-5">
        &ldquo;{body}&rdquo;
      </p>

      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 text-coven-soft-gold text-xs tracking-[0.28em] uppercase hover:text-coven-bone transition-colors"
      >
        {ctaLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </aside>
  );
}

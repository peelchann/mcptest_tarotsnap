'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
}

/**
 * FeatureCard — circular gold sigil icon at top, serif heading, fog body.
 * Hover lifts 2px and gold border brightens.
 */
export default function FeatureCard({
  icon: Icon,
  title,
  body,
  className,
}: FeatureCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'group relative h-full p-7 md:p-8 rounded-[3px]',
        'border border-[rgba(176,138,73,0.35)]',
        'bg-gradient-to-b from-coven-ink/80 via-coven-plum/30 to-coven-ink/90',
        'backdrop-blur-md',
        'transition-all duration-500',
        'hover:border-[rgba(216,182,106,0.7)] hover:shadow-coven-aura',
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full border border-[rgba(216,182,106,0.55)] bg-[radial-gradient(circle,rgba(122,69,165,0.35)_0%,rgba(11,8,16,0.95)_75%)] shadow-[inset_0_0_18px_rgba(122,69,165,0.25)]">
        <Icon className="w-6 h-6 text-coven-soft-gold" strokeWidth={1.4} />
      </div>
      <h3 className="font-serif text-2xl text-coven-bone mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-sm md:text-[0.95rem] text-coven-fog leading-relaxed font-light">
        {body}
      </p>

      {/* corner ornaments */}
      <span className="absolute top-2 right-2 text-coven-soft-gold/35 text-[10px]" aria-hidden="true">✦</span>
    </motion.article>
  );
}

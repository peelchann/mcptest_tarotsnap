import SectionFrame from '@/app/components/coven/SectionFrame';
import SpreadCard from '@/app/components/coven/SpreadCard';
import DecorativeDivider from '@/app/components/coven/DecorativeDivider';
import RitualButton from '@/app/components/coven/RitualButton';
import GhostButton from '@/app/components/coven/GhostButton';
import Link from 'next/link';
import { SPREADS } from '@/app/data/spreads';

/**
 * Spreads page — six rituals, one of which is currently live (Single).
 * Each card links to the reading flow with the spread slug as a query param;
 * the reading page can ignore the param for now.
 */
export default function SpreadsPage() {
  return (
    <div className="relative pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-14 md:pt-20">
        <header className="text-center max-w-2xl mx-auto">
          <span className="coven-kicker">Choose your ritual</span>
          <h1 className="font-serif text-coven-bone leading-[1.05] tracking-tight mt-4 text-[clamp(2.5rem,6vw,4rem)]">
            Six Spreads,{' '}
            <span className="italic text-coven-soft-gold">One Ritual</span>
          </h1>
          <p className="mt-6 text-coven-fog font-light leading-relaxed text-base md:text-lg">
            Each spread is a different geometry of attention — a different shape
            of question. Pick the one that mirrors what you came here to ask.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <RitualButton asChild>
              <Link href="/reading/single">Start with Single</Link>
            </RitualButton>
            <GhostButton asChild>
              <Link href="/journal">Your past readings</Link>
            </GhostButton>
          </div>
        </header>
      </div>

      <DecorativeDivider symbol="diamond" />

      <SectionFrame
        kicker="The deck"
        title={<>Pick a <span className="italic text-coven-soft-gold">geometry</span></>}
        body="Some questions want a single card. Others ask for the whole year. The shape you pick is itself part of the answer."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SPREADS.map((s) => (
            <SpreadCard key={s.slug} spread={s} />
          ))}
        </div>
      </SectionFrame>

      <DecorativeDivider symbol="sigil" />

      <section className="mx-auto max-w-3xl px-5 md:px-8 text-center">
        <span className="coven-kicker">A note</span>
        <p className="mt-5 font-serif italic text-[1.15rem] md:text-[1.3rem] leading-relaxed text-coven-bone">
          &ldquo;The card you draw is less interesting than what made you reach
          for the deck. The spread you choose says as much as the cards
          themselves.&rdquo;
        </p>
        <div className="mt-6 flex justify-center">
          <span className="coven-divider w-32" aria-hidden="true">
            <span className="text-coven-soft-gold/55 text-base">✦</span>
          </span>
        </div>
      </section>
    </div>
  );
}

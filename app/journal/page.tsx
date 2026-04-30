'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import SidebarNav from '@/app/components/coven/SidebarNav';
import SectionFrame from '@/app/components/coven/SectionFrame';
import RitualButton from '@/app/components/coven/RitualButton';
import GhostButton from '@/app/components/coven/GhostButton';
import JournalCard from '@/app/components/coven/JournalCard';
import ThemeInsightCard from '@/app/components/coven/ThemeInsightCard';
import MoonPhaseTimeline from '@/app/components/coven/MoonPhaseTimeline';
import InsightCard from '@/app/components/coven/InsightCard';
import DecorativeDivider from '@/app/components/coven/DecorativeDivider';
import { MOCK_JOURNAL_ENTRIES, MOCK_THEMES, MOCK_INSIGHT } from '@/app/data/journalMock';

type Tab = 'all' | 'favorites' | 'notes';

/**
 * Journal page — desktop sidebar + main content + insight rail.
 * Mock data for now; will hydrate from Supabase journal storage later.
 */
export default function JournalPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_JOURNAL_ENTRIES.filter((e) =>
    !search
      ? true
      : `${e.card.name} ${e.question ?? ''} ${e.tags.join(' ')}`
          .toLowerCase()
          .includes(search.toLowerCase()),
  );

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
        <div className="flex gap-8">
          <SidebarNav />

          <div className="flex-1 min-w-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div>
                <span className="coven-kicker">Your grimoire</span>
                <h1 className="font-serif text-coven-bone text-[clamp(2.25rem,5vw,3.25rem)] leading-tight mt-2">
                  Journal
                </h1>
                <p className="mt-3 text-coven-fog/85 max-w-xl font-light leading-relaxed">
                  Every reading you have asked of the deck — and what the deck has been asking you back.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RitualButton asChild>
                  <Link href="/reading/single">New Reading</Link>
                </RitualButton>
              </div>
            </header>

            {/* Tabs + search */}
            <div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2 border-b border-[rgba(176,138,73,0.25)]">
                {(['all', 'favorites', 'notes'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`-mb-px px-5 py-3 text-[0.72rem] tracking-[0.28em] uppercase transition-colors ${
                      tab === t
                        ? 'text-coven-soft-gold border-b border-coven-soft-gold'
                        : 'text-coven-fog/75 hover:text-coven-bone'
                    }`}
                  >
                    {t === 'all' ? 'All Readings' : t === 'favorites' ? 'Favorites' : 'Notes'}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coven-fog/55" />
                <input
                  type="search"
                  placeholder="Search your journey…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-[2px] border border-[rgba(176,138,73,0.4)] bg-coven-ink/65 text-coven-bone font-sans text-sm placeholder:text-coven-fog/50 focus:outline-none focus:border-[rgba(216,182,106,0.7)] focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Moon-phase timeline */}
            <section className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <span className="coven-kicker">Cycles</span>
                <span className="text-[0.66rem] tracking-[0.2em] uppercase text-coven-fog/65">
                  Last 9 months
                </span>
              </div>
              <MoonPhaseTimeline />
            </section>

            {/* Recurring themes */}
            <section className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <span className="coven-kicker">Recurring Themes</span>
                <Link
                  href="#insights"
                  className="text-[0.7rem] tracking-[0.22em] uppercase text-coven-fog/75 hover:text-coven-soft-gold transition-colors"
                >
                  See all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {MOCK_THEMES.map((t) => (
                  <ThemeInsightCard
                    key={t.theme}
                    theme={t.theme}
                    appearances={t.appearances}
                    trend={t.trend}
                  />
                ))}
              </div>
            </section>

            <DecorativeDivider symbol="diamond" className="my-10 md:my-12" />

            <section className="mb-12">
              <div className="mb-5 flex items-center justify-between">
                <span className="coven-kicker">Recent Readings</span>
                <span className="text-[0.7rem] tracking-[0.2em] uppercase text-coven-fog/65">
                  {filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}
                </span>
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                {filtered.length > 0 ? (
                  filtered.map((e) => <JournalCard key={e.id} entry={e} />)
                ) : (
                  <div className="col-span-full p-10 text-center rounded-[3px] border border-dashed border-[rgba(176,138,73,0.3)] text-coven-fog/70">
                    <Sparkles className="w-6 h-6 mx-auto mb-3 text-coven-soft-gold/70" />
                    <p className="font-serif italic text-lg">
                      Nothing yet on this page of the grimoire.
                    </p>
                    <p className="mt-2 text-[0.85rem]">
                      Try a different search, or pull a new card.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <div id="insights" className="mb-6">
              <span className="coven-kicker">Insight</span>
              <div className="mt-3">
                <InsightCard body={MOCK_INSIGHT} />
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <GhostButton asChild>
                <Link href="/reading/single">Pull another card</Link>
              </GhostButton>
            </div>
          </div>

          {/* desktop right rail */}
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-24 space-y-4">
              <InsightCard
                title="Pattern this season"
                body="Your most-drawn card is The High Priestess — three times in two weeks. The deck is asking you to listen inward."
                ctaLabel="Read pattern"
                ctaHref="#insights"
              />
              <ThemeInsightCard theme="Solitude" appearances={5} trend="rising" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

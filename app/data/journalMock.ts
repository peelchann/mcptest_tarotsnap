import { cards as ALL_CARDS } from './cards';
import type { JournalEntry } from '@/app/components/coven/JournalCard';

const find = (id: string) => ALL_CARDS.find((c) => c.id === id) ?? ALL_CARDS[0];

/**
 * Mock journal data for the journal page demo state.
 * Real data will replace this once Supabase journal storage lands.
 */
export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-001',
    card: find('the-high-priestess'),
    date: 'Apr 26, 2026',
    question: 'What am I not seeing about this transition?',
    tags: ['Intuition', 'Career', 'Inner truth'],
  },
  {
    id: 'j-002',
    card: find('death'),
    date: 'Apr 22, 2026',
    question: 'How do I let go of this old chapter?',
    tags: ['Transformation', 'Release', 'Endings'],
  },
  {
    id: 'j-003',
    card: find('the-star'),
    date: 'Apr 18, 2026',
    question: 'Am I on the right path with my creative work?',
    tags: ['Hope', 'Creativity', 'Renewal'],
  },
  {
    id: 'j-004',
    card: find('the-emperor'),
    date: 'Apr 12, 2026',
    question: 'What boundaries do I need to set?',
    tags: ['Boundaries', 'Authority', 'Structure'],
  },
];

export const MOCK_THEMES = [
  { theme: 'Intuition', appearances: 12, trend: 'rising' as const },
  { theme: 'Transformation', appearances: 9, trend: 'stable' as const },
  { theme: 'Boundaries', appearances: 7, trend: 'rising' as const },
];

export const MOCK_INSIGHT =
  'You often seek clarity before major shifts. The cards show you value truth and inner transformation more than approval.';

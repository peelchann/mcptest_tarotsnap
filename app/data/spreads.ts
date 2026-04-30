export interface SpreadPosition {
  /** 0-100 viewBox X */
  x: number;
  /** 0-60 viewBox Y */
  y: number;
  /** card width in viewBox units; default 12 */
  w?: number;
  /** card height in viewBox units; default 18 */
  h?: number;
  /** rotation deg */
  rotate?: number;
  /** position label (not rendered in mini diagram, but available) */
  label?: string;
}

export interface SpreadDef {
  slug: string;
  name: string;
  description: string;
  cardCount: number;
  layout: SpreadPosition[];
}

/**
 * Six spreads — one ritual at a time. Layout coords are in a 100×60 viewBox.
 */
export const SPREADS: SpreadDef[] = [
  {
    slug: 'single',
    name: 'Single Card',
    description:
      'One card, one truth. The simplest ritual — for clarity in a single breath.',
    cardCount: 1,
    layout: [{ x: 50, y: 30, label: 'Now' }],
  },
  {
    slug: 'three-card',
    name: 'Three Card',
    description:
      'Past · Present · Future. The classic arc — see where you came from, where you stand, where you head.',
    cardCount: 3,
    layout: [
      { x: 25, y: 30, label: 'Past' },
      { x: 50, y: 30, label: 'Present' },
      { x: 75, y: 30, label: 'Future' },
    ],
  },
  {
    slug: 'celtic-cross',
    name: 'Celtic Cross',
    description:
      'Ten cards mapping situation, obstacle, and unfolding. The deepest reading in the deck.',
    cardCount: 10,
    layout: [
      { x: 28, y: 30, w: 11, h: 16, label: 'Situation' },
      { x: 28, y: 30, w: 11, h: 16, rotate: 90, label: 'Obstacle' },
      { x: 28, y: 50, w: 11, h: 16, label: 'Foundation' },
      { x: 11, y: 30, w: 11, h: 16, label: 'Past' },
      { x: 28, y: 11, w: 11, h: 16, label: 'Possible' },
      { x: 45, y: 30, w: 11, h: 16, label: 'Future' },
      { x: 75, y: 50, w: 9, h: 14, label: 'Self' },
      { x: 75, y: 35, w: 9, h: 14, label: 'Environment' },
      { x: 75, y: 20, w: 9, h: 14, label: 'Hopes' },
      { x: 75, y: 5, w: 9, h: 14, label: 'Outcome' },
    ],
  },
  {
    slug: 'horseshoe',
    name: 'Horseshoe',
    description:
      'Seven cards in a curve — past, present, hidden influences, advice, environment, hopes, outcome.',
    cardCount: 7,
    layout: [
      { x: 12, y: 38, w: 11, h: 16, rotate: -25 },
      { x: 24, y: 22, w: 11, h: 16, rotate: -15 },
      { x: 38, y: 12, w: 11, h: 16, rotate: -7 },
      { x: 50, y: 8, w: 11, h: 16 },
      { x: 62, y: 12, w: 11, h: 16, rotate: 7 },
      { x: 76, y: 22, w: 11, h: 16, rotate: 15 },
      { x: 88, y: 38, w: 11, h: 16, rotate: 25 },
    ],
  },
  {
    slug: 'relationship',
    name: 'Relationship',
    description:
      'Five cards examining you, the other, and the shared field between you.',
    cardCount: 5,
    layout: [
      { x: 18, y: 30, w: 12, h: 18, label: 'You' },
      { x: 38, y: 18, w: 12, h: 18, label: 'You bring' },
      { x: 50, y: 38, w: 12, h: 18, label: 'Field' },
      { x: 62, y: 18, w: 12, h: 18, label: 'They bring' },
      { x: 82, y: 30, w: 12, h: 18, label: 'Other' },
    ],
  },
  {
    slug: 'year-ahead',
    name: 'Year Ahead',
    description:
      'Twelve cards, one per month — a quiet map of the season ahead.',
    cardCount: 12,
    layout: Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 2 * Math.PI) / 12 - Math.PI / 2;
      return {
        x: 50 + Math.cos(a) * 36,
        y: 30 + Math.sin(a) * 22,
        w: 8,
        h: 12,
        rotate: (i * 360) / 12,
      };
    }),
  },
];

export function getSpreadBySlug(slug: string): SpreadDef | undefined {
  return SPREADS.find((s) => s.slug === slug);
}

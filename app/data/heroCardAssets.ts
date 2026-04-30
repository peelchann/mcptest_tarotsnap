/**
 * Hero card assets — Major Arcana face images shipped under
 * /public/images/tarot/. Used by the homepage hero 3-card fan.
 *
 * Note on filename: `strenght.jpg` is intentional — that's how the file
 * is named on disk. Display name is "Strength".
 */

export interface HeroCardAsset {
  /** Display name, shown as alt text. */
  name: string;
  /** Public-relative path to the .jpg face artwork. */
  src: string;
  /** Optional roman numeral / number for future caption use. */
  number: string;
}

export const HERO_CARD_ASSETS: HeroCardAsset[] = [
  { name: 'The Fool', number: '0', src: '/images/tarot/the-fool.jpg' },
  { name: 'The Magician', number: 'I', src: '/images/tarot/the-magician.jpg' },
  { name: 'The High Priestess', number: 'II', src: '/images/tarot/the-high-priestess.jpg' },
  { name: 'The Empress', number: 'III', src: '/images/tarot/the-empress.jpg' },
  { name: 'The Emperor', number: 'IV', src: '/images/tarot/the-emperor.jpg' },
  { name: 'The Hierophant', number: 'V', src: '/images/tarot/the-hierophant.jpg' },
  { name: 'The Lovers', number: 'VI', src: '/images/tarot/the-lovers.jpg' },
  { name: 'The Chariot', number: 'VII', src: '/images/tarot/the-chariot.jpg' },
  { name: 'Strength', number: 'VIII', src: '/images/tarot/strenght.jpg' },
  { name: 'The Hermit', number: 'IX', src: '/images/tarot/the-hermit.jpg' },
  { name: 'Justice', number: 'XI', src: '/images/tarot/justice.jpg' },
  { name: 'The Hanged Man', number: 'XII', src: '/images/tarot/the-hanged-man.jpg' },
  { name: 'Death', number: 'XIII', src: '/images/tarot/death.jpg' },
  { name: 'Temperance', number: 'XIV', src: '/images/tarot/temperance.jpg' },
  { name: 'The Devil', number: 'XV', src: '/images/tarot/the-devil.jpg' },
  { name: 'The Tower', number: 'XVI', src: '/images/tarot/the-tower.jpg' },
  { name: 'The Star', number: 'XVII', src: '/images/tarot/the-star.jpg' },
  { name: 'The Moon', number: 'XVIII', src: '/images/tarot/the-moon.jpg' },
  { name: 'The Sun', number: 'XIX', src: '/images/tarot/the-sun.jpg' },
  { name: 'Judgement', number: 'XX', src: '/images/tarot/the-judgement.jpg' },
];

/**
 * Deterministic fallback for SSR — the same 3 cards render on server and
 * on the client's initial paint. After mount, the client useEffect swaps
 * to a random selection without any layout shift.
 */
export const FALLBACK_HERO_CARDS: HeroCardAsset[] = [
  HERO_CARD_ASSETS[2], // The High Priestess (center default — matches design)
  HERO_CARD_ASSETS[16], // The Star
  HERO_CARD_ASSETS[18], // The Sun
];

/**
 * Pick `count` unique cards. Caller ensures this only runs client-side
 * to avoid SSR/client mismatch.
 */
export function getRandomUniqueCards(
  pool: HeroCardAsset[],
  count: number,
): HeroCardAsset[] {
  if (count >= pool.length) return [...pool];
  const remaining = [...pool];
  const out: HeroCardAsset[] = [];
  for (let i = 0; i < count; i += 1) {
    const idx = Math.floor(Math.random() * remaining.length);
    out.push(remaining.splice(idx, 1)[0]);
  }
  return out;
}

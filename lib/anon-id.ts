// lib/anon-id.ts
// Stable per-browser identifier for anonymous reading logging.
// Stored in localStorage; survives across visits, resets on clear-site-data.

const KEY = 'tarotsnap_anon_id';

export function getAnonId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

// __tests__/lib/anon-id.test.ts
import { getAnonId } from '@/lib/anon-id';

describe('getAnonId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates a UUID and persists it on first call', () => {
    const id = getAnonId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(localStorage.getItem('tarotsnap_anon_id')).toBe(id);
  });

  it('returns the same UUID on subsequent calls', () => {
    const first = getAnonId();
    const second = getAnonId();
    expect(second).toBe(first);
  });

  it('does not write localStorage on subsequent calls', () => {
    getAnonId();
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    getAnonId();
    expect(setSpy).not.toHaveBeenCalled();
    setSpy.mockRestore();
  });

  it('returns empty string on the server (no window)', () => {
    const originalWindow = global.window;
    // @ts-expect-error: simulate SSR
    delete global.window;
    expect(getAnonId()).toBe('');
    global.window = originalWindow;
  });
});

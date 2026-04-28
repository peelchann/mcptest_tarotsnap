// __tests__/lib/log-anonymous-reading.test.ts
import { hashIp } from '@/lib/log-anonymous-reading';

describe('hashIp', () => {
  const originalEnv = process.env.IP_HASH_SECRET;

  afterEach(() => {
    process.env.IP_HASH_SECRET = originalEnv;
  });

  it('returns a 64-character hex string', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    const hash = hashIp('1.2.3.4');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces the same hash for the same input + secret', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    expect(hashIp('1.2.3.4')).toBe(hashIp('1.2.3.4'));
  });

  it('produces different hashes for different IPs', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    expect(hashIp('1.2.3.4')).not.toBe(hashIp('5.6.7.8'));
  });

  it('produces different hashes when the secret changes', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    const withA = hashIp('1.2.3.4');
    process.env.IP_HASH_SECRET = 'b'.repeat(64);
    const withB = hashIp('1.2.3.4');
    expect(withA).not.toBe(withB);
  });

  it('throws when IP_HASH_SECRET is missing', () => {
    delete process.env.IP_HASH_SECRET;
    expect(() => hashIp('1.2.3.4')).toThrow(/IP_HASH_SECRET/);
  });
});

// __tests__/lib/log-anonymous-reading.test.ts (continued)
import { logAnonymousReading } from '@/lib/log-anonymous-reading';

const mockInsert = jest.fn();
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ insert: mockInsert }),
  }),
}));

describe('logAnonymousReading', () => {
  beforeEach(() => {
    mockInsert.mockReset();
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'pk_test';
  });

  const baseInput = {
    anonId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    ip: '1.2.3.4',
    userAgent: 'Mozilla/5.0 test',
    referrer: 'https://google.com',
    locale: 'en',
    questionText: 'will I find love',
    spreadType: 'single',
    cardsDrawn: ['The Lovers'],
    aiResponse: 'Yes you will',
    aiModel: 'meta-llama/llama-3.1-8b-instruct',
    aiLatencyMs: 1234,
    aiTokenUsage: { prompt_tokens: 10, completion_tokens: 5 },
    error: null,
  };

  it('inserts one row with all fields mapped correctly', async () => {
    mockInsert.mockResolvedValue({ error: null });
    await logAnonymousReading(baseInput);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const inserted = mockInsert.mock.calls[0][0];
    expect(inserted).toMatchObject({
      anon_id: baseInput.anonId,
      ip_hash: expect.stringMatching(/^[0-9a-f]{64}$/),
      user_agent: baseInput.userAgent,
      question_text: baseInput.questionText,
      cards_drawn: baseInput.cardsDrawn,
      ai_response: baseInput.aiResponse,
      ai_latency_ms: 1234,
    });
  });

  it('falls back to a generated UUID when anonId is empty', async () => {
    mockInsert.mockResolvedValue({ error: null });
    await logAnonymousReading({ ...baseInput, anonId: null });
    const inserted = mockInsert.mock.calls[0][0];
    expect(inserted.anon_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('does not throw when Supabase returns an error', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'rls violation' } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(logAnonymousReading(baseInput)).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[anonymous_readings]'),
      expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it('times out after 2 seconds and logs without throwing', async () => {
    jest.useFakeTimers();
    mockInsert.mockImplementation(() => new Promise(() => {})); // never resolves
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const promise = logAnonymousReading(baseInput);
    jest.advanceTimersByTime(2001);
    await expect(promise).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[anonymous_readings]'),
      expect.objectContaining({ message: expect.stringContaining('timed out') })
    );
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });
});

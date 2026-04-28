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

import { logAnonymousReading } from '@/lib/log-anonymous-reading';

describe('logAnonymousReading', () => {
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

  let fetchMock: jest.Mock;
  let originalFetch: typeof globalThis.fetch | undefined;

  beforeEach(() => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'pk_test';
    originalFetch = globalThis.fetch;
    fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
  });

  afterEach(() => {
    if (originalFetch) globalThis.fetch = originalFetch;
    else delete (globalThis as { fetch?: unknown }).fetch;
    jest.restoreAllMocks();
  });

  function makeResponse(status: number, body = ''): Response {
    return {
      ok: status >= 200 && status < 300,
      status,
      text: async () => body,
    } as unknown as Response;
  }

  it('POSTs to /rest/v1/anonymous_readings with auth headers and mapped payload', async () => {
    fetchMock.mockResolvedValue(makeResponse(201));
    await logAnonymousReading(baseInput);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.supabase.co/rest/v1/anonymous_readings');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      apikey: 'pk_test',
      Authorization: 'Bearer pk_test',
      'Content-Type': 'application/json',
    });
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
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
    fetchMock.mockResolvedValue(makeResponse(201));
    await logAnonymousReading({ ...baseInput, anonId: null });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.anon_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('does not throw when the REST call returns a non-2xx status', async () => {
    fetchMock.mockResolvedValue(makeResponse(401, 'rls violation'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(logAnonymousReading(baseInput)).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('status=401'));
  });

  it('does not throw when fetch itself rejects (network error)', async () => {
    fetchMock.mockRejectedValue(new Error('boom'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(logAnonymousReading(baseInput)).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('boom'));
  });
});

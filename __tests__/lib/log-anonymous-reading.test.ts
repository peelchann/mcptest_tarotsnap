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

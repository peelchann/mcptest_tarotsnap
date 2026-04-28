// lib/log-anonymous-reading.ts
import { createHmac } from 'crypto';

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error('IP_HASH_SECRET not configured');
  return createHmac('sha256', secret).update(ip).digest('hex');
}

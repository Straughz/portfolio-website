import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const GUARD_LIMITS = {
  tokenMinAgeMs: 3_000,
  tokenMaxAgeMs: 2 * 60 * 60 * 1_000,
  perIp: [{ count: 3, windowMs: 10 * 60 * 1_000 }, { count: 8, windowMs: 24 * 60 * 60 * 1_000 }],
  global: [{ count: 30, windowMs: 60 * 60 * 1_000 }, { count: 120, windowMs: 24 * 60 * 60 * 1_000 }],
  duplicateWindowMs: 24 * 60 * 60 * 1_000,
};
export type GuardLimits = typeof GUARD_LIMITS;
export type TokenVerdict = 'ok' | 'invalid' | 'young' | 'expired';
export type GuardVerdict = 'ok' | 'rate_limited' | 'duplicate';

// Signed timestamps reject forged or instant form submissions.
export function issueToken(secret: string, now = Date.now()): string {
  const issued = String(now);
  return `${issued}.${createHmac('sha256', secret).update(issued).digest('hex')}`;
}

export function verifyToken(secret: string, token: unknown, now = Date.now(), limits: GuardLimits = GUARD_LIMITS): TokenVerdict {
  if (typeof token !== 'string') return 'invalid';
  const match = /^(0|[1-9]\d*)\.([a-f0-9]{64})$/.exec(token);
  if (!match) return 'invalid';
  const issued = Number(match[1]);
  if (!Number.isSafeInteger(issued)) return 'invalid';
  const expected = createHmac('sha256', secret).update(match[1]).digest();
  const supplied = Buffer.from(match[2], 'hex');
  if (!timingSafeEqual(expected, supplied)) return 'invalid';
  const age = now - issued;
  if (age < limits.tokenMinAgeMs) return 'young';
  if (age > limits.tokenMaxAgeMs) return 'expired';
  return 'ok';
}

// A fingerprint suppresses repeated tickets without retaining their text.
export function fingerprint(email: string, message: string): string {
  return createHash('sha256').update(`${email.toLowerCase()}\n${message}`).digest('hex');
}

export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded !== null) return forwarded.split(',').at(-1)?.trim() || null;
  return headers.get('x-real-ip')?.trim() || null;
}

export type Guard = { check: (ip: string | null, print: string, now?: number) => GuardVerdict };

// Sliding windows slow repeated submissions from one address and across the site.
export function createGuard(limits: GuardLimits = GUARD_LIMITS): Guard {
  const globalTimes: number[] = [];
  const ipTimes = new Map<string, number[]>();
  const prints = new Map<string, number>();
  const longestWindow = Math.max(0, ...limits.global.map((item) => item.windowMs), ...limits.perIp.map((item) => item.windowMs));

  function prune(times: number[], cutoff: number): void {
    let removed = 0;
    while (removed < times.length && times[removed] <= cutoff) removed++;
    if (removed) times.splice(0, removed);
  }

  function full(times: number[], windows: GuardLimits['global'], now: number): boolean {
    return windows.some(({ count, windowMs }) => times.filter((time) => time > now - windowMs).length >= count);
  }

  function sweep(now: number): void {
    if (ipTimes.size > 500) {
      for (const [ip, times] of ipTimes) {
        prune(times, now - longestWindow);
        if (!times.length) ipTimes.delete(ip);
      }
    }
    if (prints.size > 2000) {
      for (const [print, time] of prints) {
        if (time <= now - limits.duplicateWindowMs) prints.delete(print);
      }
    }
  }

  return {
    check(ip, print, now = Date.now()) {
      prune(globalTimes, now - longestWindow);
      const prior = prints.get(print);
      if (prior !== undefined && prior > now - limits.duplicateWindowMs) return 'duplicate';
      if (prior !== undefined) prints.delete(print);

      const times = ip === null ? null : (ipTimes.get(ip) ?? []);
      if (times) prune(times, now - longestWindow);
      if (full(globalTimes, limits.global, now) || (times !== null && full(times, limits.perIp, now))) return 'rate_limited';

      globalTimes.push(now);
      if (ip !== null && times) {
        times.push(now);
        ipTimes.set(ip, times);
      }
      prints.set(print, now);
      sweep(now);
      return 'ok';
    },
  };
}

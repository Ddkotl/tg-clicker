import { redis } from "../connect/redis_connect";

export async function rateLimitRedis(key: string, limit: number, windowSeconds: number) {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  const remaining = Math.max(0, limit - current);
  return { allowed: current <= limit, remaining, current };
}

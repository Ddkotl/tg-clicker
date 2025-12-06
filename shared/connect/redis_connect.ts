import { Facts } from "@/_generated/prisma/client";
import Redis from "ioredis";

// Логирование для диагностики
console.log("Redis password from env:", process.env.REDIS_PASSWORD);

export const redis_conf = {
  host: "127.0.0.1", // лучше явно 127.0.0.1, а не localhost
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times: number) {
    // Попытка переподключения каждые 2 секунды
    return Math.min(times * 2000, 10000);
  },
};

export const redis = new Redis(redis_conf);

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("ready", () => console.log("✅ Redis ready and authenticated"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export async function pushToSubscriber(userId: string, payload: Facts["type"]) {
  try {
    console.log("Publishing payload for user:", userId, payload);
    await redis.publish(`user:${userId}`, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to publish payload:", err);
  }
}

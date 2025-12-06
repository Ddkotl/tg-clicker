import { Facts } from "@/_generated/prisma";
import Redis from "ioredis";

export const redis_conf = {
  host: "localhost",
  port: 6379,
  password: process.env.REDIS_PASSWORD!,
};

export const redis = new Redis(redis_conf);

export async function pushToSubscriber(userId: string, payload: Facts["type"]) {
  console.log("payload", payload);
  await redis.publish(`user:${userId}`, JSON.stringify(payload));
}

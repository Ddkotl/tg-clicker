import Redis from "ioredis";

export const redis_conf = {
  host: "localhost",
  port: 6379,
  password: process.env.REDIS_PASSWORD!,
};

export const redis = new Redis(redis_conf);

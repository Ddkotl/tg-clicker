import Redis from "ioredis";

export const redis_conf = {
  host: "localhost",
  port: 6379,
};

export const redis = new Redis(redis_conf);

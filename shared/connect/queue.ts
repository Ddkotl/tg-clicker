import { RedisOptions } from "ioredis";
import { Queue } from "bullmq";

export const redis_connect: RedisOptions = {
  host: "127.0.0.1",
  port: 6379,
};

export const meditationQueue = new Queue("meditation", {
  connection: redis_connect,
});

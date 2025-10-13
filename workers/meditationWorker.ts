import { giveMeditationReward } from "@/entities/meditation/index.server";
import { redis_connect } from "@/shared/connect/queue";
import { Worker } from "bullmq";

const meditation_worker = new Worker(
  "meditation",
  async (job) => {
    const { userId } = job.data;
    await giveMeditationReward(userId);
  },
  {
    connection: redis_connect,
  },
);

meditation_worker.on("completed", () => {
  console.log("meditation worker completed");
});

meditation_worker.on("failed", (_, err) => {
  console.log("meditation worker failed", err);
});

import "dotenv/config";
import {
  MEDITATION_EXCHANGE,
  MEDITATION_QUEUE,
} from "@/features/meditation/rabit_meditation_connect";
import { RABBITMQ_URL } from "@/shared/lib/consts";
import amqp from "amqplib";

if (!process.env.WORKER_SECRET) {
  console.error("❌ WORKER_SECRET is not set in environment");
  process.exit(1);
}

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(MEDITATION_EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  await channel.assertQueue(MEDITATION_QUEUE, { durable: true });
  await channel.bindQueue(
    MEDITATION_QUEUE,
    MEDITATION_EXCHANGE,
    MEDITATION_QUEUE,
  );

  console.log("⏳ Meditation worker is waiting for messages...");

  channel.consume(
    MEDITATION_QUEUE,
    async (msg) => {
      if (!msg) return;
      try {
        const { userId } = JSON.parse(msg.content.toString());
        console.log(`💫 Meditation completed for user ${userId}`);
        await fetch(
          "https://tmp-regulations-horn-scanning.trycloudflare.com/api/headquarter/meditation/get_meditation_reward",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-worker-secret": process.env.WORKER_SECRET!,
            },
            body: JSON.stringify({ userId }),
          },
        );
        console.log(`💫 Meditation reward get for user ${userId}`);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Meditation worker failed:", err);
        channel.nack(msg, false, true);
      }
    },
    { noAck: false },
  );
}

startWorker().catch((err) => {
  console.error("RabbitMQ connection failed:", err);
  process.exit(1);
});

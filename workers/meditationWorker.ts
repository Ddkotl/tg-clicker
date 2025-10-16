import amqp from "amqplib";
import { giveMeditationReward } from "@/entities/meditation/index.server";
import { EXCHANGE, QUEUE } from "@/shared/connect/rabbitmq";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, QUEUE);

  console.log("⏳ Meditation worker is waiting for messages...");

  channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;
      try {
        const { userId } = JSON.parse(msg.content.toString());
        console.log(`💫 Meditation completed for user ${userId}`);
        await giveMeditationReward(userId);
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

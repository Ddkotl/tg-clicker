import "dotenv/config";
import amqp from "amqplib";
import { MEDITATION_EXCHANGE, MEDITATION_QUEUE } from "@/features/meditation/rabit_meditation_connect";
import { RABBITMQ_URL } from "@/shared/connect/consts";
import { meditationWorkerCongig } from "@/shared/lib/workers";
import { dataBase } from "@/shared/connect/db_connect";
import { MeditationRewardService } from "@/features/meditation/services/meditation_reward_service";
import { api_path } from "@/shared/lib/paths";

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.prefetch(meditationWorkerCongig.prfetch);

  await channel.assertExchange(MEDITATION_EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  await channel.assertQueue(MEDITATION_QUEUE, {
    durable: true,
  });
  await channel.bindQueue(MEDITATION_QUEUE, MEDITATION_EXCHANGE, MEDITATION_QUEUE);

  console.log("⏳ Meditation worker is waiting for messages...");

  channel.consume(
    MEDITATION_QUEUE,
    async (msg) => {
      if (!msg) return;

      try {
        const { userId } = JSON.parse(msg.content.toString());
        const res = await fetch(`${process.env.APP_DOMEN}${api_path.get_meditation_revard()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, break_meditation: false }),
        });
        const json = await res.json();
        if (!res.ok) throw json;
        console.log(`✅ Meditation reward given to ${userId}`);
        channel.ack(msg);
        return json;
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

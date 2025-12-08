import "dotenv/config";
import amqp from "amqplib";
import { RABBITMQ_URL } from "@/shared/connect/consts";
import { SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE } from "@/features/spirit_path/mq_spirit_path_connect";
import { api_path } from "@/shared/lib/paths";

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(SPIRIT_PATH_EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  await channel.assertQueue(SPIRIT_PATH_QUEUE, {
    durable: true,
  });
  await channel.bindQueue(SPIRIT_PATH_QUEUE, SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE);

  console.log("⏳ Spirit PAth worker is waiting for messages...");

  channel.consume(
    SPIRIT_PATH_QUEUE,
    async (msg) => {
      if (!msg) return;

      try {
        const { userId } = JSON.parse(msg.content.toString());
        const res = await fetch(`${process.env.APP_DOMEN}${api_path.get_spirit_path_reward()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-worker-secret": process.env.WORKER_SECRET || "" },
          body: JSON.stringify({ userId, break_spirit_path: false }),
        });
        const json = await res.json();
        if (!res.ok) throw json;
        console.log(`✅ SPIRIT_PATH reward given to ${userId}`);
        channel.ack(msg);
        return json;
      } catch (err) {
        console.error("❌ SPIRIT_PATH worker failed:", err);
        channel.ack(msg);

        channel.publish(SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE, Buffer.from(msg.content), {
          headers: { "x-delay": 3000 },
        });
      }
    },
    { noAck: false },
  );
}

startWorker().catch((err) => {
  console.error("RabbitMQ connection failed:", err);
  process.exit(1);
});

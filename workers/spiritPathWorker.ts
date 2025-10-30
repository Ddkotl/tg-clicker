import "dotenv/config";
import amqp from "amqplib";
import { createFact } from "@/entities/facts/index.server";
import { FactsStatus, FactsType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { RABBITMQ_URL } from "@/shared/lib/consts";
import { SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE } from "@/features/spirit_path/mq_spirit_path_connect";
import { giveSpiritPathReward } from "@/entities/spirit_path/_repositories/give_spirit_path_reward";

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(SPIRIT_PATH_EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  await channel.assertQueue(SPIRIT_PATH_QUEUE, { durable: true });
  await channel.bindQueue(SPIRIT_PATH_QUEUE, SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE);

  console.log("⏳ Spirit PAth worker is waiting for messages...");

  channel.consume(
    SPIRIT_PATH_QUEUE,
    async (msg) => {
      if (!msg) return;

      try {
        const { userId } = JSON.parse(msg.content.toString());
        console.log(`💫 Spirit Path completed for user ${userId}`);

        const res = await giveSpiritPathReward(userId);

        if (res) {
          const new_fact = await createFact({
            fact_type: FactsType.SPIRIT_PATH,
            fact_status: FactsStatus.NO_CHECKED,
            userId: userId,
            active_minutes: res.minutes,
            exp_reward: res.reward_exp,
            qi_reward: res.reward_qi,
            reward_spirit_stone: res.reward_spirit_stone,
          });

          if (new_fact) pushToSubscriber(userId, new_fact.type);
          console.log(`✅ SPIRIT_PATH reward given to ${userId}`);
        } else {
          console.warn(`⚠️ No reward for user ${userId}`);
        }

        channel.ack(msg);
      } catch (err) {
        console.error("❌ SPIRIT_PATH worker failed:", err);
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

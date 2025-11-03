import "dotenv/config";
import amqp from "amqplib";
import { giveMeditationReward } from "@/entities/meditation/index.server";
import { createFact } from "@/entities/facts/index.server";
import { FactsStatus, FactsType } from "@/_generated/prisma";
import { pushToSubscriber } from "@/app/api/user/facts/stream/route";
import { MEDITATION_EXCHANGE, MEDITATION_QUEUE } from "@/features/meditation/rabit_meditation_connect";
import { RABBITMQ_URL } from "@/shared/lib/consts";
import { meditationWorkerCongig } from "@/shared/productivity_config/workers";
import { dataBase } from "@/shared/connect/db_connect";

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
        const { userId, start_meditation } = JSON.parse(msg.content.toString());
        const meditation = await dataBase.meditation.findUnique({
          where: { userId },
        });
        if (!meditation) return channel.ack(msg);

        // 1️⃣ Проверка массива отменённых путей
        if (meditation.canceled_meditated_dates?.some((d) => d.getTime() === new Date(start_meditation).getTime())) {
          await dataBase.meditation.update({
            where: { userId },
            data: {
              canceled_meditated_dates: {
                set: meditation.canceled_meditated_dates.filter(
                  (d) => d.getTime() !== new Date(start_meditation).getTime(),
                ),
              },
            },
          });
          return channel.ack(msg); // путь отменён, сообщение удаляем
        }

        // 2️⃣ Проверка текущего активного пути
        if (
          !meditation.on_meditation ||
          meditation.start_meditation?.getTime() !== new Date(start_meditation).getTime()
        ) {
          return channel.ack(msg); // сообщение устарело, удаляем
        }
        console.log(`💫 Meditation completed for user ${userId}`);

        const res = await giveMeditationReward(userId);

        if (res) {
          const new_fact = await createFact({
            fact_type: FactsType.MEDITATION,
            fact_status: FactsStatus.NO_CHECKED,
            userId: userId,
            active_hours: res.hours,
            exp_reward: res.reward_exp,
            qi_reward: res.reward_qi,
          });

          if (new_fact) pushToSubscriber(userId, new_fact.type);
          console.log(`✅ Meditation reward given to ${userId}`);
        } else {
          console.warn(`⚠️ No reward for user ${userId}`);
        }

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

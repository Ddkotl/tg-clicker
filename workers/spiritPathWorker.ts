import "dotenv/config";
import amqp from "amqplib";
import { RABBITMQ_URL } from "@/shared/lib/consts";
import { SPIRIT_PATH_EXCHANGE, SPIRIT_PATH_QUEUE } from "@/features/spirit_path/mq_spirit_path_connect";
import { dataBase } from "@/shared/connect/db_connect";
import { SpiritPathRewardServices } from "@/features/spirit_path/services/spirit_path_reward_services";

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
        const { userId, start_spirit_paths } = JSON.parse(msg.content.toString());
        const spiritPath = await dataBase.spiritPath.findUnique({
          where: { userId },
        });
        if (!spiritPath) return channel.ack(msg);

        // 1️⃣ Проверка массива отменённых путей
        if (spiritPath.canceled_paths_dates?.some((d) => d.getTime() === new Date(start_spirit_paths).getTime())) {
          await dataBase.spiritPath.update({
            where: { userId },
            data: {
              canceled_paths_dates: {
                set: spiritPath.canceled_paths_dates.filter(
                  (d) => d.getTime() !== new Date(start_spirit_paths).getTime(),
                ),
              },
            },
          });
          return channel.ack(msg); // путь отменён, сообщение удаляем
        }

        // 2️⃣ Проверка текущего активного пути
        if (
          !spiritPath.on_spirit_paths ||
          spiritPath.start_spirit_paths?.getTime() !== new Date(start_spirit_paths).getTime()
        ) {
          return channel.ack(msg); // сообщение устарело, удаляем
        }
        console.log(`💫 Spirit Path completed for user ${userId}`);

        const { res } = await SpiritPathRewardServices(userId);
        if (res) {
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

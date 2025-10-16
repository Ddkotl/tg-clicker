import { RABBITMQ_URL } from "@/shared/lib/consts";
import amqp from "amqplib";

export const HP_REGEN_EXCHANGE = "hp_regen_delayed";
export const HP_REGEN_QUEUE = "hp_regen";

export async function createRabbitMeditationConnection() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Объявляем delayed exchange
  await channel.assertExchange(HP_REGEN_EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  // Создаём очередь и биндим её к exchange
  await channel.assertQueue(HP_REGEN_QUEUE, { durable: true });
  await channel.bindQueue(HP_REGEN_QUEUE, HP_REGEN_EXCHANGE, HP_REGEN_QUEUE);

  return { connection, channel };
}

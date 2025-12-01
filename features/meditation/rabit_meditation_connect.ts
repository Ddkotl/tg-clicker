import { RABBITMQ_URL } from "@/shared/connect/consts";
import amqp from "amqplib";

export const MEDITATION_EXCHANGE = "meditation_delayed";
export const MEDITATION_QUEUE = "meditation";

export async function createRabbitMeditationConnection() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Объявляем delayed exchange
  await channel.assertExchange(MEDITATION_EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  // Создаём очередь и биндим её к exchange
  await channel.assertQueue(MEDITATION_QUEUE, {
    durable: true,
  });
  await channel.bindQueue(MEDITATION_QUEUE, MEDITATION_EXCHANGE, MEDITATION_QUEUE);

  return { connection, channel };
}

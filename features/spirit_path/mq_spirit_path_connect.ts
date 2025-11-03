import { RABBITMQ_URL } from "@/shared/lib/consts";
import amqp from "amqplib";

export const SPIRIT_PATH_EXCHANGE = "spitir_path_delayed";
export const SPIRIT_PATH_QUEUE = "spitir_path";

export async function createMqSpiritPathConnection() {
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

  return { connection, channel };
}

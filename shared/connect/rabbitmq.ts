import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE = "meditation-delayed";
const QUEUE = "meditation";

export async function createRabbitConnection() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Объявляем delayed exchange
  await channel.assertExchange(EXCHANGE, "x-delayed-message", {
    durable: true,
    arguments: { "x-delayed-type": "direct" },
  });

  // Создаём очередь и биндим её к exchange
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, QUEUE);

  return { connection, channel };
}

export { EXCHANGE, QUEUE };

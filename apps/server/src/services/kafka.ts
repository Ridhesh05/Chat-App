import { Kafka, EachMessagePayload } from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./prisma/ca.pem"), "utf-8")],
  },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
});

let producer: any = null;
let consumer: any = null;

export async function createProducer() {
  if (producer) return producer;
  producer = kafka.producer();
  await producer.connect();
  return producer;
}

export async function produceMessage(message: string) {
  const p = await createProducer();
  await p.send({
    topic: "messages",
    messages: [{ value: message }],
  });
}

export async function startMessageConsumer(callback: (msg: string) => Promise<void>) {
  if (consumer) return consumer;
  consumer = kafka.consumer({ groupId: "chat-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "messages", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const text = message.value?.toString() || "";
      await callback(text);
    },
  });

  return consumer;
}

export default kafka;

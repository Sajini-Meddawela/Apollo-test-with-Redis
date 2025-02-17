import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const redisPublisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const publishAgentStats = async (stats: Record<string, any>) => {
  await redisPublisher.publish("AGENT_UPDATES", JSON.stringify(stats));
};

export { redis };

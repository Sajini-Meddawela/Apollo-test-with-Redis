import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

// Create separate Redis clients for publishing and subscribing
export const subscriberClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
export const publisherClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Use RedisPubSub for subscriptions
export const pubsub = new RedisPubSub({
  publisher: publisherClient,
  subscriber: subscriberClient,
});

// Constants
export const AGENT_UPDATES = "AGENT_UPDATES";

// Define the stats interface
export interface AgentStats {
  totalConversations: number;
  activeChats: number;
  responseTime: string;
  resolutionRate: number;
}

// Function to publish stats
export const publishAgentStats = (stats: AgentStats) => {
  pubsub.publish(AGENT_UPDATES, { agentUpdated: stats });
};

// Handle Redis connection errors
subscriberClient.on("error", (error) => {
  console.error("Redis Subscriber Error:", error);
});

publisherClient.on("error", (error) => {
  console.error("Redis Publisher Error:", error);
});

// Cleanup function for graceful shutdown
export const cleanup = () => {
  subscriberClient.quit();
  publisherClient.quit();
};

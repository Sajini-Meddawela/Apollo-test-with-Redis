import { Redis } from "ioredis";
import { PubSub } from "graphql-subscriptions";

// Create separate Redis clients for publishing and subscribing
export const subscriberClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
export const publisherClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
export const pubsub = new PubSub();

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
  publisherClient.publish(AGENT_UPDATES, JSON.stringify(stats));
};

// Subscribe to Redis for real-time updates
subscriberClient.subscribe(AGENT_UPDATES, (err) => {
  if (err) {
    console.error("Error subscribing to Redis channel:", err);
    return;
  }
  console.log("✅ Successfully subscribed to Redis channel:", AGENT_UPDATES);
});

subscriberClient.on("message", (channel, message) => {
  if (channel === AGENT_UPDATES) {
    try {
      const parsedMessage = JSON.parse(message);
      pubsub.publish(AGENT_UPDATES, { agentUpdated: parsedMessage });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  }
});

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
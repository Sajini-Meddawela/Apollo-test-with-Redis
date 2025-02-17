import { publishAgentStats, cleanup } from "./redis-pubsub";
import type { AgentStats } from "./redis-pubsub";

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

setInterval(() => {
  const updatedStats: AgentStats = {
    totalConversations: Math.floor(Math.random() * 2000),
    activeChats: Math.floor(Math.random() * 100),
    responseTime: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
    resolutionRate: parseFloat((Math.random() * 100).toFixed(1)),
  };

  publishAgentStats(updatedStats);
}, 5000);

console.log("🚀 Stats updater started...");
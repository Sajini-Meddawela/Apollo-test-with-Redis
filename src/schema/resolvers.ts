import { pubsub, AGENT_UPDATES, AgentStats } from "../redis-pubsub";

// Keep track of the latest stats
let currentStats: AgentStats = {
  totalConversations: 0,
  activeChats: 0,
  responseTime: "0m 0s",
  resolutionRate: 0,
};

// Update current stats when new data comes in
pubsub.subscribe(AGENT_UPDATES, (payload) => {
  currentStats = payload.agentUpdated;
});

const resolvers = {
  Query: {
    // Return current stats for initial load
    getAgentStats: (): AgentStats => currentStats,
  },
  Subscription: {
    // Real-time updates
    agentUpdated: {
      subscribe: () => pubsub.asyncIterator([AGENT_UPDATES]),
    },
  },
};

export default resolvers;
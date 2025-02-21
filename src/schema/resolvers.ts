import { pubsub, AGENT_UPDATES, AgentStats } from "../redis-pubsub";

let currentStats: AgentStats = {
  totalConversations: 0,
  activeChats: 0,
  responseTime: "0m 0s",
  resolutionRate: 0,
};

const resolvers = {
  Query: {
    getAgentStats: (): AgentStats => currentStats,
  },
  Subscription: {
    agentUpdated: {
      subscribe: () => pubsub.asyncIterator([AGENT_UPDATES]),
    },
  },
};

export default resolvers;

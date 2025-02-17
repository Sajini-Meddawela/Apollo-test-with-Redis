const typeDefs = `#graphql
  type AgentStats {
    totalConversations: Int!
    activeChats: Int!
    responseTime: String!
    resolutionRate: Float!
  }

  type Query {
    getAgentStats: AgentStats!
  }

  type Subscription {
    agentUpdated: AgentStats!
  }
`;

export default typeDefs;
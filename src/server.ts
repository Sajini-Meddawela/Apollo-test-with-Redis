import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express, { Express } from "express";
import { createServer, Server } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";
import dotenv from "dotenv";
import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";
import "./redis-pubsub";

dotenv.config();

async function startServer() {
  const app: Express = express();
  
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }));

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded"
  });

  await apolloServer.start();

  app.use("/graphql", express.json(), expressMiddleware(apolloServer, {
    context: async ({ req }) => ({ req })
  }));

  const httpServer: Server = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
  });

  useServer({ schema }, wsServer);

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(`🚀 Apollo Server running at http://localhost:${PORT}/graphql`);
    console.log(`📡 WebSocket listening at ws://localhost:${PORT}/graphql`);
  });

  return { app, httpServer, apolloServer };
}

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled promise rejection:", error);
});

startServer().catch((error) => {
  console.error("❌ Error starting server:", error);
  process.exit(1);
});

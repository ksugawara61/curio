import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { resolvers, typeDefs } from "./schema.js";

const app = express();
const port = process.env.PORT || 4000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(apolloServer));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const server = app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});

export { app, apolloServer, server };

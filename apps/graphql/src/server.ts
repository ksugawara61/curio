import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { hello } from "./application/queries/hello/hello";
import type { Resolvers } from "./schema/generated/graphql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema/schema.graphql"),
  "utf-8",
);

// A map of functions which return data for the schema.
const resolvers: Resolvers = {
  Query: {
    hello: () => hello({}).message,
  },
};

export const app = express();
export const httpServer = http.createServer(app);

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./schema.js";

const app = express();
const port = process.env.PORT || 4000;

app.all("/graphql", createHandler({ schema }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const server = app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});

export { app, server };

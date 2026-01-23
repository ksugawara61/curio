import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import { app, httpServer, server } from "./server";

await server.start();

app.use(cors(), express.json(), expressMiddleware(server));

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log("🚀 Server ready at http://localhost:4000");

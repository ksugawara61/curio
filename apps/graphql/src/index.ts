import { app } from "@getcronit/pylon";

import { authorize } from "./application/endpoints/authorize";
import { authorized } from "./application/endpoints/authorized";
import { server } from "./server";

// to opt-out pylon telemetry data
// ref: https://pylon.cronit.io/docs/telemetry
process.env.PYLON_TELEMETRY_DISABLED = "1";

export const graphql = server;

app.on(["GET"], "/", authorized);

app.on(["POST", "GET"], "/api/auth/**", authorize);

export default app;

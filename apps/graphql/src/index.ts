import { app } from "@getcronit/pylon";

import { scheduled } from "./batch";
import { server } from "./server";

// to opt-out pylon telemetry data
// ref: https://pylon.cronit.io/docs/telemetry
process.env.PYLON_TELEMETRY_DISABLED = "1";

export const graphql = server;

export default {
  fetch: app.fetch.bind(app),
  scheduled,
};

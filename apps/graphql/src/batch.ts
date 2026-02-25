import type { getEnv } from "@getcronit/pylon";
import { syncAllRssFeeds } from "./application/rss-feed/mutations/sync-all-rss-feeds";

export const scheduled = async (
  _controller?: ScheduledController,
  env?: ReturnType<typeof getEnv>,
  _ctx?: ExecutionContext,
): Promise<void> => {
  console.log("[batch] Starting RSS feed fetch batch job...");
  await syncAllRssFeeds(env);
  console.log("[batch] RSS feed fetch batch job completed.");
};

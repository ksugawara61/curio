import { execSync } from "node:child_process";

const testDbFile = "./test-database.db";

export const setup = async () => {
  process.env.TURSO_DATABASE_URL = `file:${testDbFile}`;

  console.log("Setting up test database...");
  execSync("pnpm db:generate", { stdio: "inherit" });
  execSync("pnpm db:migrate", { stdio: "inherit" });
  console.log("Test database setup completed.");
};

export const teardown = async () => {
  // Clean up the test database
  if (process.env.TURSO_DATABASE_URL?.startsWith(`file:${testDbFile}`)) {
    execSync(`rm ${testDbFile}`, { stdio: "inherit" });
  }
};

import "@getcronit/pylon";

declare module "@getcronit/pylon" {
  interface Bindings {
    SECRET_KEY: string;
    TURSO_DATABASE_URL: string;
    TURSO_AUTH_TOKEN: string;
    CLERK_SECRET_KEY: string;
    NODE_ENV?: string;
    TEST_AUTH_KEY?: string;
  }

  interface Variables {
    userId?: string;
  }
}

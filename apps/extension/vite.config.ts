import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: "copy-manifest",
      closeBundle() {
        // distディレクトリが存在しない場合は作成
        mkdirSync(resolve(__dirname, "dist"), { recursive: true });

        // manifest.jsonをコピー
        copyFileSync(
          resolve(__dirname, "public/manifest.json"),
          resolve(__dirname, "dist/manifest.json")
        );
      },
    },
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/libs/test/setup.ts"],
  },
});

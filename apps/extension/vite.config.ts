import { copyFileSync, mkdirSync, renameSync, rmSync } from "node:fs";
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
        mkdirSync(resolve(__dirname, "dist/src/pages/"), { recursive: true });

        // manifest.jsonをコピー
        copyFileSync(
          resolve(__dirname, "public/manifest.json"),
          resolve(__dirname, "dist/manifest.json"),
        );

        // HTMLファイルを正しい場所に移動
        mkdirSync(resolve(__dirname, "dist/popup"), { recursive: true });
        mkdirSync(resolve(__dirname, "dist/sidepanel"), { recursive: true });

        renameSync(
          resolve(__dirname, "dist/src/pages/popup/index.html"),
          resolve(__dirname, "dist/popup/index.html"),
        );
        renameSync(
          resolve(__dirname, "dist/src/pages/sidepanel/index.html"),
          resolve(__dirname, "dist/sidepanel/index.html"),
        );

        // 空のsrcディレクトリを削除
        rmSync(resolve(__dirname, "dist/src"), {
          recursive: true,
          force: true,
        });
      },
    },
  ],
  resolve: {
    alias: {
      react: resolve(__dirname, "node_modules/react"),
      "react-dom": resolve(__dirname, "node_modules/react-dom"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/pages/popup/index.html"),
        sidepanel: resolve(__dirname, "src/pages/sidepanel/index.html"),
      },
    },
  },
});

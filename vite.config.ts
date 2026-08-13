import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(__dirname, "./tests/setup.ts")],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    fs: {
      allow: [__dirname, path.resolve(__dirname, "..")],
    },
  },
});

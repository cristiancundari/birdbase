/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom", // or 'jsdom', 'node'
    globals: true,
    setupFiles: [
      "@testing-library/react/dont-cleanup-after-each",
      "./setup-test.tsx",
    ],
    reporters: ["verbose"],
    css: true,
  },
});

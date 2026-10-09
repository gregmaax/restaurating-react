import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "~",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      // Next's server renderer supplies React with cache(); the installed React 18 does not.
      {
        find: /^react$/,
        replacement: fileURLToPath(
          new URL(
            "./node_modules/next/dist/compiled/react/index.js",
            import.meta.url,
          ),
        ),
      },
    ],
  },
  test: {
    environment: "node",
    testTimeout: 30_000,
  },
});

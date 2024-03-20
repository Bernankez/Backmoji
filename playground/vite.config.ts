import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        /**
         * @see https://github.com/unjs/unbuild/issues/121
         */
        backmoji: resolve("../packages/core/src/index.ts"),
      },
    },
  };
});

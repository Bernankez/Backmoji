import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      /**
       * @see https://github.com/unjs/unbuild/issues/121
       */
      "backmoji": resolve("../packages/core/src/index.ts"),
      "@backmoji/react": resolve("../packages/react/src/index.ts"),
    },
  },
}));

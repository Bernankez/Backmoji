import { resolve } from "node:path";
import { defineConfig } from "astro/config";
import { transformerTwoslash } from "@shikijs/twoslash";
import UnoCSS from "unocss/astro";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS({
    injectReset: true,
  }), react(), vue(), mdx()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "rose-pine-moon",
      },
      transformers: [
        // transformerTwoslash()
      ],
    },
  },
  vite: {
    resolve: {
      alias: {
        "~": resolve("."),
        "@": resolve("./src"),
        /**
         * @see https://github.com/unjs/unbuild/issues/121
         */
        "backmoji": resolve("../packages/core/src/index.ts"),
        "@backmoji/react": resolve("../packages/react/src/index.ts"),
        "@backmoji/vue": resolve("../packages/vue/src/index.ts"),
      },
    },
  },
});

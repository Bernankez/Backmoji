import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetTypography({
    cssExtend: () => ({
      h1: {
        color: "#f97316",
      },
      h2: {
        color: "#f97316",
      },
      h3: {
        color: "#f97316",
      },
      h4: {
        color: "#f97316",
      },
      h5: {
        color: "#f97316",
      },
      h6: {
        color: "#f97316",
      },
    }),
  })],
  shortcuts: {
    h1: "font-italic font-bold text-orange-500 text-7xl md:text-8xl",
    h2: "font-italic font-bold text-orange-500 text-5xl md:text-6xl",
    h3: "font-italic font-bold text-orange-700 text-xl md:text-2xl",
  },
});

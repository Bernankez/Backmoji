import { defineConfig, presetIcons, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  shortcuts: {
    h1: "font-bold font-italic text-7xl md:text-8xl lg:text-9xl text-orange-500",
    h2: "font-italic font-bold text-orange-500 text-5xl md:text-6xl",
  },
});

import bernankez from "@bernankez/eslint-config";

export default bernankez({
  unocss: true,
  astro: true,
  formatters: {
    astro: true,
    html: true,
    css: true,
    markdown: true,
  },
  vue: true,
  javascript: {
    overrides: {
      "no-async-promise-executor": "off",
    },
  },
});

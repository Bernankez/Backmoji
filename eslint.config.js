import bernankez from "@bernankez/eslint-config";

export default bernankez({
  unocss: true,
  astro: true,
  formatters: true,
  vue: true,
  javascript: {
    overrides: {
      "no-async-promise-executor": "off",
    },
  },
});

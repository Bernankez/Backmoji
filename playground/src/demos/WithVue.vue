<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/vue";
import VueLogo from "/vue.svg?url";

const canvasRef = ref<HTMLCanvasElement>();
const image = useImageLoader(VueLogo);
const renderer = useImageRenderer(image);
const { render } = useBackmoji(canvasRef, renderer, {
  rowGap: 15,
  columnGap: 20,
  degree: 30,
});
watchEffect(() => {
  render();
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

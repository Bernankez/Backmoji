<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/vue";
import VueLogo from "/vue.svg?url";
import { useElementSize } from "@vueuse/core";

const divRef = ref<HTMLDivElement>();
const { width, height } = useElementSize(divRef);

const canvasRef = ref<HTMLCanvasElement>();
const image = useImageLoader(VueLogo);
const renderer = useImageRenderer(image);
const { setSize, render } = useBackmoji(canvasRef, renderer, {
  rowGap: 30,
  columnGap: 30,
});
watchEffect(() => {
  setSize(width.value, height.value);
  render();
});
</script>

<template>
  <div ref="divRef" class="rounded-md bg-orange-50">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

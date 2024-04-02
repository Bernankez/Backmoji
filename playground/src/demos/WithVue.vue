<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useBackmoji, useImageLoader, useImageRenderer, useTextRenderer } from "@backmoji/vue";
import VueLogo from "/vue.svg?url";
import { useElementSize } from "@vueuse/core";

const divRef = ref<HTMLDivElement>();
const { width, height } = useElementSize(divRef);

const canvasRef = ref<HTMLCanvasElement>();
const image = useImageLoader(VueLogo);
const renderer = useImageRenderer(image);
const backmojiResult = useBackmoji(renderer, canvasRef, {
  rowGap: 30,
  columnGap: 30,
});
watchEffect(() => {
  if (backmojiResult.value) {
    backmojiResult.value.setSize(width.value, height.value);
    backmojiResult.value.render();
  }
});
</script>

<template>
  <div ref="divRef" class="rounded-md bg-orange-50">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
